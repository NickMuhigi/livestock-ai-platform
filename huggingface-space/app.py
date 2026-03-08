"""
Hugging Face Space: Cattle Disease Detection Model API
FastAPI service for serving cattle_model.keras predictions
"""
import os
import logging
from pathlib import Path
from typing import Dict, Any
import numpy as np
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from tensorflow import keras

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
CLASS_LABELS = ["FOOT_AND_MOUTH", "HEALTHY", "LUMPY_SKIN", "MASTITIS"]
IMG_SIZE = (224, 224)

# Global model instance
model = None
model_loaded = False
model_error = None


def load_model():
    """Load the Keras model at startup"""
    global model, model_loaded, model_error
    
    try:
        logger.info(f"Loading model from {MODEL_PATH}...")
        
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")
        
        # Load model with compatibility settings
        model = keras.models.load_model(MODEL_PATH, compile=False)
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        model_loaded = True
        model_size = os.path.getsize(MODEL_PATH)
        logger.info(f"Model loaded successfully! Size: {model_size / 1e6:.1f} MB")
        logger.info(f"Model input shape: {model.input_shape}")
        logger.info(f"Model output shape: {model.output_shape}")
        
    except Exception as e:
        model_loaded = False
        model_error = str(e)
        logger.error(f"Failed to load model: {e}", exc_info=True)
        raise


def preprocess_image(image: Image.Image) -> np.ndarray:
    """Preprocess image for model input"""
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize to model input size
    image = image.resize(IMG_SIZE)
    
    # Convert to array and normalize
    img_array = np.array(image, dtype=np.float32)
    img_array = img_array / 255.0  # Normalize to [0, 1]
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array


@app.on_event("startup")
async def startup_event():
    """Load model when the service starts"""
    load_model()


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
        raise HTTPException(
            status_code=503,
            detail=f"Model not loaded. Error: {model_error}"
        )
    
    try:
        # Read and preprocess image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        logger.info(f"Processing image: {file.filename}, size: {image.size}, mode: {image.mode}")
        
        # Preprocess
        processed_image = preprocess_image(image)
        
        # Run inference
        predictions = model.predict(processed_image, verbose=0)
        
        # Get predicted class
        predicted_idx = int(np.argmax(predictions[0]))
        predicted_class = CLASS_LABELS[predicted_idx]
        confidence = float(predictions[0][predicted_idx])
        
        # Build response with all class probabilities
        class_probabilities = {
            label: float(prob)
            for label, prob in zip(CLASS_LABELS, predictions[0])
        }
        
        logger.info(f"Prediction: {predicted_class} (confidence: {confidence:.2%})")
        
        return {
            "success": True,
            "prediction": predicted_class,
            "confidence": confidence,
            "probabilities": class_probabilities,
            "all_classes": CLASS_LABELS,
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


# Add missing import for BytesIO
import io


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
