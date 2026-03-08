# 🚀 Quick Start - Render Deployment

## Pre-Deployment Checklist

```powershell
# 1. Run Git LFS setup script
.\setup-git-lfs.ps1

# 2. Verify model is tracked
git lfs ls-files
# Should show: cattle_model.keras

# 3. Commit and push
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

## Deploy to Render

1. **Go to [render.com](https://render.com)** → Sign in with GitHub
2. **New +** → **Blueprint**
3. **Select repository**: `livestock-ai-platform`
4. **Apply** (Render auto-detects `render.yaml`)

## Configure Environment Variables

### Frontend (`livestock-frontend`)
Set these in the Render dashboard:

```env
NEXTAUTH_URL=https://livestock-frontend.onrender.com
BACKEND_API_URL=https://livestock-backend.onrender.com
MODEL_API_URL=https://livestock-backend.onrender.com
GEMINI_API_KEY=your_gemini_api_key_here
```

## Verify Deployment

```bash
# Backend health
curl https://livestock-backend.onrender.com/health

# Frontend health
curl https://livestock-frontend.onrender.com/api/health
```

## 📚 Full Guide

See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed instructions and troubleshooting.

---

### Service URLs After Deployment
- Frontend: `https://livestock-frontend.onrender.com`
- Backend: `https://livestock-backend.onrender.com`
- Database: Internal (auto-connected)

### Free Tier Notes
- Services auto-sleep after 15 minutes of inactivity
- First request after sleep may take 30-60 seconds
- 750 hours/month across all services
