# Hugging Face Space Deployment Guide

## Quick Start: Deploy Your Model API in 5 Minutes

### Step 1: Create Hugging Face Account
1. Go to https://huggingface.co/join
2. Sign up (free account is fine)
3. Verify your email

### Step 2: Create a New Space
1. Go to https://huggingface.co/new-space
2. Fill in:
   - **Owner**: Your username
   - **Space name**: `livestock-disease-detector`
   - **License**: MIT
   - **Select SDK**: Choose **Docker** (important!)
   - **Space hardware**: CPU basic (free tier is fine)
3. Click **Create Space**

### Step 3: Upload Files to Your Space

Once the space is created, you'll see a file interface. Upload these files:

#### Required Files (from `huggingface-space/` folder):
1. `app.py` - The API application
2. `requirements.txt` - Dependencies
3. `Dockerfile` - Container config
4. `README.md` - Documentation
5. **`cattle_model.keras`** - Your model file (404MB - upload from project root)

**How to upload:**
- Click "Files" tab in your Space
- Click "Add file" → "Upload files"
- Drag and drop all 5 files
- Or use Git LFS (see Advanced section below)

### Step 4: Wait for Build
- Hugging Face will automatically:
  - Build the Docker container (~3-5 minutes)
  - Install dependencies
  - Start the API
- Watch the "Logs" tab for build progress
- Once you see `Application startup complete`, you're live! 🎉

### Step 5: Get Your API URL
Your API is now available at:
```
https://huggingface.co/spaces/YOUR_USERNAME/livestock-disease-detector
```

The direct API endpoint is:
```
https://YOUR_USERNAME-livestock-disease-detector.hf.space
```

### Step 6: Test Your Space

Test the health endpoint:
```bash
curl https://YOUR_USERNAME-livestock-disease-detector.hf.space/health
```

Expected response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_path": "cattle_model.keras",
  "class_labels": ["FOOT_AND_MOUTH", "HEALTHY", "LUMPY_SKIN", "MASTITIS"]
}
```

Test prediction with an image:
```bash
curl -X POST "https://YOUR_USERNAME-livestock-disease-detector.hf.space/predict" \
  -F "file=@path/to/cattle_image.jpg"
```

### Step 7: Update Your Render Backend

In Render dashboard, update the environment variable for your `livestock-backend` service:

```
MODEL_API_URL=https://YOUR_USERNAME-livestock-disease-detector.hf.space/predict
```

Then **manually deploy** the backend service (no code changes needed).

### Step 8: Verify End-to-End

1. Check Render backend health:
   ```bash
   curl https://livestock-backend-qk6p.onrender.com/health
   ```

2. Test image analysis through your frontend:
   - Visit https://livestock-frontend.onrender.com
   - Upload a cattle image
   - Should now work! 🎉

---

## Advanced: Using Git to Upload Files

If you prefer Git over the web interface:

### 1. Clone Your Space Repository
```bash
git clone https://huggingface.co/spaces/YOUR_USERNAME/livestock-disease-detector
cd livestock-disease-detector
```

### 2. Configure Git LFS for the Model File
```bash
git lfs install
git lfs track "cattle_model.keras"
```

### 3. Copy Files
```bash
# Copy all files from huggingface-space folder
cp ../livestock-ai-platform/huggingface-space/* .
cp ../livestock-ai-platform/cattle_model.keras .
```

### 4. Push to Hugging Face
```bash
git add .
git commit -m "Initial deployment: FastAPI cattle disease detection"
git push
```

---

## Troubleshooting

### "Model not found" Error
- Make sure `cattle_model.keras` is uploaded to the Space root directory
- Check the "Files" tab in your Space to verify the file exists

### Build Failed
- Check "Logs" tab for error messages
- Common issues:
  - Missing `cattle_model.keras` file
  - Incorrect Dockerfile syntax (should already be correct in provided file)

### Prediction Errors
- Verify model loaded: check `/health` endpoint
- Check image format: must be JPG, PNG, or similar
- Check logs in your Space's "Logs" tab

### Space is Sleeping
- Free Hugging Face Spaces sleep after inactivity
- First request may take 30-60 seconds to wake up
- Upgrade to paid tier for always-on service (optional)

---

## Cost Comparison

| Option | Cost | Pros | Cons |
|--------|------|------|------|
| **HF Spaces Free** | $0/month | Easy setup, generous free tier | Sleeps after inactivity |
| **HF Spaces Paid** | $0.60/month | Always on, faster CPU | Small monthly cost |
| **Render + Git LFS** | $0/month | Integrated with main app | LFS issues, complex setup |

**Recommendation**: Start with HF Spaces Free tier, upgrade to paid only if sleep time becomes an issue.

---

## Next Steps After Deployment

1. ✅ Space deployed and model loading
2. ✅ Update `MODEL_API_URL` in Render backend
3. ✅ Redeploy Render backend
4. ✅ Test end-to-end via frontend
5. 🎯 Monitor Space logs for performance
6. 🎯 Consider upgrading to paid tier if needed

Need help? Check the Hugging Face Spaces documentation: https://huggingface.co/docs/hub/spaces
