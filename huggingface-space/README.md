---
title: Cattle Disease Detection API
emoji: 🐄
colorFrom: green
colorTo: blue
sdk: docker
pinned: false
license: mit
---

# Cattle Disease Detection Model API

FastAPI service for detecting diseases in cattle from images using a trained TensorFlow/Keras model.

## Model Details

- **Input**: RGB images (automatically resized to 224x224)
- **Output**: Disease classification
- **Classes**: 
  - FOOT_AND_MOUTH
  - HEALTHY
  - LUMPY_SKIN
  - MASTITIS

## API Endpoints

### `GET /`
Service information and available endpoints

### `GET /health`
Health check with model status

### `POST /predict`
Upload an image for disease prediction

**Request**: Multipart form data with `file` field
**Response**: JSON with prediction, confidence, and probabilities

## Setup Instructions

### 1. Create Hugging Face Space

1. Go to https://huggingface.co/spaces
2. Click "Create new Space"
3. Name: `livestock-disease-detector` (or your choice)
4. SDK: Select **Docker**
5. Visibility: Public (or Private)
6. Click "Create Space"

### 2. Upload Files

Upload these files to your Space:
- `app.py` - The FastAPI application
- `requirements.txt` - Python dependencies
- `README.md` - This file
- `Dockerfile` - Container configuration
- `cattle_model.keras` - Your trained model (upload directly via UI)

### 3. The Space will automatically:
- Build the Docker container
- Install dependencies
- Load the model
- Start the API server

### 4. Get Your API URL

Once deployed, your API will be available at:
```
https://YOUR_USERNAME-livestock-disease-detector.hf.space
```

## Usage Example

```python
import requests

# Your Hugging Face Space URL
API_URL = "https://YOUR_USERNAME-livestock-disease-detector.hf.space/predict"

# Upload image
with open("cattle_image.jpg", "rb") as f:
    response = requests.post(API_URL, files={"file": f})
    result = response.json()
    
print(f"Disease: {result['prediction']}")
print(f"Confidence: {result['confidence']:.2%}")
```

## Testing

Test the API using curl:
```bash
curl -X POST "https://YOUR_USERNAME-livestock-disease-detector.hf.space/predict" \
  -F "file=@cattle_image.jpg"
```

## Integration with Render Backend

Update your Render backend environment variable:
```
MODEL_API_URL=https://YOUR_USERNAME-livestock-disease-detector.hf.space/predict
```

Your backend will forward image analysis requests to this API.
