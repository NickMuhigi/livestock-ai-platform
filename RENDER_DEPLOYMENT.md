# Render Deployment Guide - Livestock AI Platform

## Overview
This guide walks you through deploying the Livestock AI Platform on Render with a complete fresh setup.

## Architecture
- **Frontend**: Next.js web service (Node.js)
- **Backend**: FastAPI ML service (Python with TensorFlow/Keras)
- **Database**: PostgreSQL managed database
- **Model**: 404MB Keras model file tracked with Git LFS

---

## Prerequisites

### 1. Install Git LFS
```bash
# Windows (using Git for Windows)
git lfs install

# Verify installation
git lfs version
```

### 2. Track the Model File with Git LFS
```bash
# The .gitattributes file is already configured
# Migrate the model file to LFS if not already done
git lfs migrate import --include="*.keras" --everything

# Verify LFS tracking
git lfs ls-files
# Should show: cattle_model.keras

# Push LFS files
git lfs push --all origin main
```

### 3. Push to GitHub
Ensure your repository is pushed to GitHub (Render will connect to it):
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

---

## Render Deployment Steps

### Step 1: Create a Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 2: Deploy Using Blueprint (render.yaml)

#### Option A: Deploy via Dashboard
1. Click **"New +"** → **"Blueprint"**
2. Select your `livestock-ai-platform` repository
3. Render will automatically detect `render.yaml`
4. Click **"Apply"**

#### Option B: Deploy via Command Line
```bash
# Install Render CLI (optional)
npm install -g @render/cli

# Deploy blueprint
render blueprint deploy
```

### Step 3: Configure Environment Variables

After deployment starts, you need to set environment variables in the Render dashboard:

#### Frontend Service (`livestock-frontend`)
Go to the frontend service → **Environment** tab:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | *Auto-set from database* | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | *Auto-generated* | NextAuth.js secret |
| `NEXTAUTH_URL` | `https://livestock-frontend.onrender.com` | Your frontend URL |
| `JWT_SECRET` | *Auto-generated* | JWT signing secret |
| `BACKEND_API_URL` | `https://livestock-backend.onrender.com` | Your backend URL |
| `MODEL_API_URL` | `https://livestock-backend.onrender.com` | Same as backend URL |
| `GEMINI_API_KEY` | Your Gemini API key | For AI assistant features |

#### Backend Service (`livestock-backend`)
The backend uses minimal environment variables. Verify:

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `7860` | *Auto-set* |
| `PYTHON_VERSION` | `3.11.0` | *Auto-set* |

---

## Step 4: Verify Deployment

### Check Service Health

1. **Backend Health**
   ```bash
   curl https://livestock-backend.onrender.com/health
   ```
   Expected response:
   ```json
   {
     "status": "healthy",
     "model_loaded": true,
     "model_path": "/opt/render/project/src/cattle_model.keras",
     "model_size_bytes": 404634408
   }
   ```

2. **Frontend Health**
   ```bash
   curl https://livestock-frontend.onrender.com/api/health
   ```
   Expected response:
   ```json
   {
     "status": "healthy",
     "service": "livestock-ai-platform-frontend",
     "timestamp": "2026-03-08T..."
   }
   ```

3. **Database Connection**
   The frontend build will run Prisma migrations. Check the build logs for:
   ```
   ✓ Prisma schema loaded
   ✓ Migrations applied successfully
   ```

---

## Step 5: Run Database Migrations

Database migrations run automatically during the frontend build via:
```bash
npx prisma migrate deploy
```

If you need to run migrations manually:
1. Go to frontend service → **Shell** tab
2. Run:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed  # if you have seed data
   ```

---

## Troubleshooting

### Issue: Model File Not Loading (503 Error)

**Cause**: Git LFS pointer uploaded instead of actual file

**Solution**:
```bash
# Verify LFS is tracking the model
git lfs ls-files

# If not listed, track it
git lfs track "*.keras"
git add .gitattributes cattle_model.keras
git commit -m "Track model with Git LFS"

# Migrate existing file to LFS
git lfs migrate import --include="cattle_model.keras"

# Force push LFS objects
git lfs push --all origin main

# Trigger Render redeploy
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

### Issue: Build Fails - Prisma Client Not Generated

**Cause**: Prisma client not generated during build

**Solution**: The `render.yaml` includes `npx prisma generate` in the build command. If it still fails, check:
1. `DATABASE_URL` is set correctly
2. The database service is running
3. Build logs for specific Prisma errors

### Issue: Frontend Can't Connect to Backend

**Cause**: Environment variables not set correctly

**Solution**:
1. Go to frontend service → Environment
2. Set `BACKEND_API_URL` to your backend service URL
3. Set `MODEL_API_URL` to the same backend URL
4. Manually trigger redeploy

### Issue: Cold Start Delays (Free Tier)

**Behavior**: Services spin down after 15 minutes of inactivity

**Impact**: First request after idle may take 30-60 seconds

**Solutions**:
- Upgrade to paid tier for always-on services
- Implement a keepalive ping service
- Set up cron job to ping services every 10 minutes

---

## Service URLs

After deployment, your services will be available at:

- **Frontend**: `https://livestock-frontend.onrender.com`
- **Backend**: `https://livestock-backend.onrender.com`
- **Database**: Internal (accessible via `DATABASE_URL`)

---

## Updating the Deployment

### Automatic Deployments
Render auto-deploys on every push to your main branch (configured in `render.yaml`).

### Manual Deploy
1. Go to service in Render dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Rolling Back
1. Go to service → **"Deploys"** tab
2. Find a previous successful deploy
3. Click **"Rollback"**

---

## Cost Estimate (Free Tier)

| Service | Plan | Cost |
|---------|------|------|
| Frontend (Next.js) | Free Web Service | $0/month |
| Backend (FastAPI) | Free Web Service | $0/month |
| PostgreSQL | Free Database | $0/month |
| **Total** | | **$0/month** |

**Limitations**:
- Services spin down after 15 min inactivity
- 750 hours/month (combines across services)
- 512MB RAM per service
- Shared CPU

---

## Production Recommendations

For production use, consider upgrading to paid tiers:

1. **Starter Plan ($7/month per service)**
   - Always-on (no spin-down)
   - More RAM and CPU
   - Custom domains

2. **Standard Database ($7/month)**
   - Better performance
   - Automated backups
   - 1GB storage

3. **Add Custom Domain**
   - `app.yourdomain.com` for frontend
   - `api.yourdomain.com` for backend

---

## Monitoring & Logs

### View Logs
1. Go to service in Render dashboard
2. Click **"Logs"** tab
3. Filter by:
   - Build logs
   - Deploy logs
   - Runtime logs

### Set Up Alerts
1. Go to service → **"Settings"**
2. Add notification channels (email, Slack)
3. Configure alerts for:
   - Failed deploys
   - High error rates
   - Service downtime

---

## Next Steps

1. ✅ Deploy services using `render.yaml`
2. ✅ Configure environment variables
3. ✅ Verify all health endpoints
4. ✅ Test the application end-to-end
5. 📋 Set up monitoring and alerts
6. 📋 Configure custom domain (optional)
7. 📋 Set up continuous integration tests

---

## Support

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Git LFS Guide**: https://git-lfs.github.com

---

## Quick Reference Commands

```bash
# Check Git LFS status
git lfs ls-files

# Verify model file size (should be ~404MB, not ~150 bytes)
ls -lh cattle_model.keras

# Push LFS files
git lfs push --all origin main

# Check service health
curl https://livestock-backend.onrender.com/health
curl https://livestock-frontend.onrender.com/api/health

# View Prisma migrations status (in Render shell)
npx prisma migrate status

# Generate Prisma client
npx prisma generate
```
