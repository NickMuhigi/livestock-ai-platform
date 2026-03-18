
# Herd AI: Livestock Health Management Platform
#
## Demo
- [Video walkthrough](https://drive.google.com/file/d/1IhiLub_UjQdqkYT8ZwwzWAHMCBRRLrZ3/view?usp=sharing)
- [Live app](https://livestock-frontend.onrender.com/)

## Screenshots & Testing Results

Below are screenshots demonstrating core functionalities, testing with different data values, and performance on various environments. Replace these placeholders with your actual screenshots before submission.

### Dashboard & Disease Analysis
![Dashboard Screenshot](screenshots/dashboard.png)
![Disease Analysis Screenshot](screenshots/analysis.png)

### Vet Booking & History
![Vet Booking Screenshot](screenshots/booking.png)
![Analyses History Screenshot](screenshots/history.png)

### Testing with Different Data Values
![Healthy Cattle Result](screenshots/healthy.png)
![Disease Detected Result](screenshots/disease.png)

### Performance & Error Handling
![Performance Screenshot](screenshots/performance.png)
![Error Handling Screenshot](screenshots/error.png)
- [Video walkthrough](https://drive.google.com/file/d/1IhiLub_UjQdqkYT8ZwwzWAHMCBRRLrZ3/view?usp=sharing)
- [Live app](https://livestock-frontend.onrender.com/)

## Overview
Herd AI is a full-stack web platform for livestock disease screening, vet booking, and herd health tracking. It uses AI-powered image analysis, persistent cloud storage, and robust authentication to deliver a seamless experience for farmers and veterinarians.

## Features & Workflow
- User registration and login
- Cattle image upload and disease analysis
- Persistent image storage (Supabase Storage)
- Results and image URLs stored in PostgreSQL for history and vet review
- Vet appointment booking and review
- AI chat assistant (Gemini)
- Analyses history with filtering/search and delete-all button

## Technologies Used
- **Frontend:** Next.js (App Router)
- **Backend:** FastAPI (Python), Next.js API routes (Node.js)
- **Model Inference:** TensorFlow/Keras, Hugging Face Space, FastAPI proxy
- **Storage:** Supabase Storage
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** JWT
- **Deployment:** Render (Blueprint for frontend/backend/db), Hugging Face Space (model API)
- **Other:** Docker, PowerShell/Bash scripts, Prisma migrations

## Repository Structure
- `app/`: Next.js pages and API routes
- `components/`: UI components
- `lib/`: Auth, model inference, email, helpers
- `backend/`: FastAPI services (proxy, model server)
- `huggingface-space/`: Dockerized FastAPI model API
- `prisma/`: Database schema and migrations
- `scripts/`: Helper scripts (Python inference bridge)

## Setup Instructions

### Local Setup
1. Clone the repo:
   ```bash
   git clone <your-repo-url>
   cd livestock-ai-platform
   npm install
   ```
2. Create `.env.local` with required secrets and API URLs (see below for sample).
3. Run Prisma migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
4. Start frontend:
   ```bash
   npm run dev
   ```
5. (Optional) Start backend proxy:
   ```bash
   cd backend
   pip install -r requirements_proxy.txt
   uvicorn app_proxy:app --host 0.0.0.0 --port 8010
   ```

### Sample `.env.local`
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/herd_ai?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
MODEL_API_URL="http://127.0.0.1:7860/predict"
GEMINI_API_KEY=""
EMAIL_USER=""
EMAIL_PASSWORD=""
EMAIL_FROM=""
```

## Deployment (Production)

- **Render Blueprint:**
  - Frontend: Next.js app
  - Backend: FastAPI proxy
  - Database: Managed PostgreSQL
  - All services defined in `render.yaml`
- **Hugging Face Space:**
  - Dockerized FastAPI model API
  - Model file (`cattle_model.keras`) uploaded to Space
  - API URL used in frontend/backend env vars

### Step-by-Step Deployment
1. Push repo to GitHub.
2. Deploy Hugging Face Space from `huggingface-space/`.
3. Deploy Render services using `render.yaml`.
4. Set required environment variables.
5. Run Prisma commands during deploy.
6. Verify health endpoints and end-to-end flow.

## API Documentation

- `/api/analyze`: Image analysis (calls model API, stores results)
- `/api/analyses`: Fetch and delete analyses history (GET, DELETE)
- `/api/auth/signup`: User registration
- `/api/auth/login`: User login
- `/api/chat`: Gemini AI chat
- `/api/health`: Health check endpoint
- FastAPI backend: `/predict`, `/health`, `/` (model info)

## Common Issues & Solutions
- Model API unavailable: Set `MODEL_API_URL` to a reachable endpoint.
- Prisma errors: Check `DATABASE_URL`, run migrations.
- Upload failures: Set `BLOB_READ_WRITE_TOKEN` for Vercel.
- Gemini chat errors: Ensure `GEMINI_API_KEY` is valid.

## Useful Commands
- `npm run dev`, `npm run build`, `npm run start`, `npm run lint`
- `npx prisma generate`, `npx prisma migrate dev`
- `pip install -r requirements.txt`
- `uvicorn app:app --host 0.0.0.0 --port 7860`

## Contributing
1. Create a branch: `git checkout -b feature/<name>`
2. Commit: `git commit -m "feat: <summary>"`
3. Push and open a PR

