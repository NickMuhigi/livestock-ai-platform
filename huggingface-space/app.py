"""
Hugging Face Space: Cattle Disease Detection Model API
FastAPI service for serving cattle_model.keras predictions
"""
import os
import logging
from pathlib import Path
from typing import Dict, Any
from threading import Lock

# Configure logging FIRST
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

logger.info("Starting imports...")
import io
import numpy as np
logger.info("✓ NumPy imported")
from PIL import Image
logger.info("✓ PIL imported")
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
logger.info("✓ FastAPI imported")
logger.info("All imports successful!")

# Initialize FastAPI app
app = FastAPI(
    title="Cattle Disease Detection API",
    description="ML model API for detecting cattle diseases from images",
    version="1.0.0"
)

# Enable CORS for all origins (Render backend can call this)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model configuration
MODEL_PATH = "cattle_model.keras"
DEFAULT_CLASS_LABELS = ["FOOT_AND_MOUTH", "HEALTHY", "LUMPY_SKIN", "MASTITIS"]
IMG_SIZE = (224, 224)


def resolve_class_labels() -> list[str]:
    raw = os.getenv("MODEL_CLASS_LABELS", "").strip()
    if not raw:
        return DEFAULT_CLASS_LABELS
    labels = [part.strip().upper() for part in raw.split(",") if part.strip()]
    return labels or DEFAULT_CLASS_LABELS


CLASS_LABELS = resolve_class_labels()

# Global model instance
model = None
model_loaded = False
model_error = None
model_lock = Lock()
model_has_rescaling = False


def infer_model_input_size(loaded_model: Any) -> tuple[int, int]:
    """Infer expected (height, width) from keras model.input_shape."""
    shape = getattr(loaded_model, "input_shape", None)
    if not shape:
        return IMG_SIZE

    # Handle lists/tuples like [(None, H, W, C)]
    if isinstance(shape, (list, tuple)) and len(shape) > 0 and isinstance(shape[0], (list, tuple)):
        shape = shape[0]

    if not isinstance(shape, (list, tuple)) or len(shape) < 3:
        return IMG_SIZE

    height = shape[1]
    width = shape[2]
    if isinstance(height, int) and isinstance(width, int) and height > 0 and width > 0:
        return (height, width)

    return IMG_SIZE


def has_rescaling_layer(layer: Any, visited: set[int] | None = None) -> bool:
    if visited is None:
        visited = set()
    if id(layer) in visited:
        return False
    visited.add(id(layer))

    if layer.__class__.__name__ == "Rescaling":
        return True

    nested_layers = getattr(layer, "layers", None)
    if not nested_layers:
        return False

    return any(has_rescaling_layer(nested, visited) for nested in nested_layers)


def load_model():
    """Load the Keras model at startup"""
    global model, model_loaded, model_error, IMG_SIZE, model_has_rescaling

    # Avoid duplicate loads across concurrent requests.
    if model_loaded and model is not None:
        return

    with model_lock:
        if model_loaded and model is not None:
            return

    try:
        logger.info(f"Loading model from {MODEL_PATH}...")

        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

        import tensorflow as tf
        from tensorflow import keras

        logger.info("TensorFlow imported; loading model file now...")

        # Load model with compatibility settings
        model = keras.models.load_model(MODEL_PATH, compile=False)
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )

        # Align preprocessing with the model's expected input dimensions.
        IMG_SIZE = infer_model_input_size(model)
        model_has_rescaling = has_rescaling_layer(model)

        model_loaded = True
        model_error = None
        model_size = os.path.getsize(MODEL_PATH)
        logger.info(f"Model loaded successfully! Size: {model_size / 1e6:.1f} MB")
        logger.info(f"Model input shape: {model.input_shape}")
        logger.info(f"Using preprocess input size: {IMG_SIZE}")
        logger.info(f"Model output shape: {model.output_shape}")
        logger.info(f"Model has internal Rescaling layer: {model_has_rescaling}")

    except Exception as e:
        model_loaded = False
        model_error = str(e)
        logger.error(f"Failed to load model: {e}", exc_info=True)
        raise


def preprocess_image(image: Image.Image, normalize: bool) -> np.ndarray:
    """Preprocess image for model input"""
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize to model input size
    image = image.resize(IMG_SIZE)
    
    # Convert to array and normalize when model has no internal Rescaling layer
    img_array = np.array(image, dtype=np.float32)
    if normalize:
        img_array = img_array / 255.0  # Normalize to [0, 1]
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array


@app.on_event("startup")
async def startup_event():
    """Startup hook intentionally avoids model load to prevent boot-time crash loops."""
    logger.info("API startup complete. Model will be loaded lazily on first /predict request.")


@app.get("/")
async def root():
    """Root endpoint with API info"""
    return {
        "service": "Cattle Disease Detection API",
        "status": "online",
        "model_loaded": model_loaded,
        "endpoints": {
            "health": "/health",
            "predict": "/predict (POST with image file)"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy" if model_loaded else "unhealthy",
        "model_loaded": model_loaded,
        "model_error": model_error,
        "model_path": MODEL_PATH if model_loaded else None,
        "class_labels": CLASS_LABELS if model_loaded else None,
        "input_size": IMG_SIZE
    }


@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    """
    Predict cattle disease from uploaded image
    
    Args:
        file: Image file (JPG, PNG, etc.)
    
    Returns:
        JSON with prediction results
    """
    if not model_loaded:
        try:
            load_model()
        except Exception as e:
            raise HTTPException(
                status_code=503,
                detail=f"Model failed to load: {str(e)}"
            )
    
    try:
        # Read and preprocess image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        logger.info(f"Processing image: {file.filename}, size: {image.size}, mode: {image.mode}")
        
        # Preprocess
        normalize_input = not model_has_rescaling
        processed_image = preprocess_image(image, normalize=normalize_input)
        
        # Run inference
        predictions = model.predict(processed_image, verbose=0)
        
        scores = [float(prob) for prob in predictions[0]]
        output_count = len(scores)
        class_labels = CLASS_LABELS[:output_count] if output_count <= len(CLASS_LABELS) else [
            *CLASS_LABELS,
            *[f"CLASS_{i+1}" for i in range(len(CLASS_LABELS), output_count)],
        ]

        # Get predicted class
        predicted_idx = int(np.argmax(scores))
        predicted_class = class_labels[predicted_idx]
        confidence = float(scores[predicted_idx])
        
        # Build response with all class probabilities
        class_probabilities = {
            label: float(prob)
            for label, prob in zip(class_labels, scores)
        }
        
        logger.info(f"Prediction: {predicted_class} (confidence: {confidence:.2%})")
        
        return {
            "success": True,
            "prediction": predicted_class,
            "confidence": confidence,
            "probabilities": class_probabilities,
            "all_classes": class_labels,
            "image_info": {
                "filename": file.filename,
                "original_size": image.size,
                "processed_size": IMG_SIZE
            }
        }
        
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
