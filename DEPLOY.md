# Deployment guide

This repository contains a Vite React frontend (`frontend/`) and an Express backend (`backend/`). Below are step-by-step commands and options to deploy both parts.

## Frontend — Vercel

1. Install and login to Vercel CLI

```bash
npm install -g vercel
vercel login
```

2. From the project root deploy the frontend

```bash
# from frontend folder
cd frontend
vercel --prod

# OR from repo root (explicitly target frontend)
vercel --prod --cwd frontend
```

3. Add production environment variables (run once per variable; you will be prompted for values)

Use these exact names (match your backend env usage):

- `MONGODB_URI`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `JWT_SECRET`
- `JWT_EXPIRE` (optional)
- `EMAIL_USER`
- `EMAIL_PASS`
- `CLIENT_URL` (optional — the frontend origin)
- `NEXT_PUBLIC_API_BASE_URL` (the public frontend variable that points to your backend URL)

Example:

```bash
vercel env add MONGODB_URI production
vercel env add RAZORPAY_KEY_ID production
vercel env add RAZORPAY_KEY_SECRET production
vercel env add JWT_SECRET production
vercel env add EMAIL_USER production
vercel env add EMAIL_PASS production
vercel env add NEXT_PUBLIC_API_BASE_URL production
```

4. Re-deploy after adding env vars

```bash
vercel --prod --cwd frontend
```

Notes
- The `frontend/vercel.json` is present to build the Vite `dist` and route SPA paths to `index.html`.
- Vercel cannot run a long-lived Express server as-is — choose one of the backend hosting options below.

## Backend — options

Option A — Host externally (recommended)
- Use Render, Railway, Heroku, or a VPS to host the Express backend.
- Example (Heroku):

```bash
# from backend folder
cd backend
heroku create my-ipl-backend
git push heroku main
heroku config:set MONGODB_URI="<value>" RAZORPAY_KEY_ID="<id>" RAZORPAY_KEY_SECRET="<secret>" JWT_SECRET="<secret>" EMAIL_USER="<email>" EMAIL_PASS="<pass>"
```

- Example (Render): Create a new Web Service -> connect GitHub repo -> Build Command: `npm install && npm run build` (if you have build step) or `npm install` -> Start Command: `node server.js`. Set environment variables in the Render dashboard.

Option B — Container / Docker
- Build and push a container to any container registry and run on a cloud provider.

```bash
# from backend folder
docker build -t ipl-backend:latest .
docker run -e MONGODB_URI="..." -e RAZORPAY_KEY_ID="..." -e RAZORPAY_KEY_SECRET="..." -p 5000:5000 ipl-backend:latest
```

Option C — Convert to serverless on Vercel (advanced)
- Refactor Express routes into serverless functions under `frontend/api/` and deploy everything on Vercel. This requires reworking middleware/state and is only recommended for a subset of routes.

## Files added to help deployments
- `frontend/vercel.json` — Vercel static-build config (already present).
- `backend/Dockerfile` — simple Node Dockerfile to containerize the backend.
- `backend/Procfile` — for Heroku-style deployments.

## Quick checklist
- [ ] Connect repository to Vercel
- [ ] Deploy frontend via `vercel --prod`
- [ ] Add production env vars in Vercel (or host backend elsewhere and set `NEXT_PUBLIC_API_BASE_URL`)
- [ ] Deploy backend to target provider and confirm `/api/health` returns `ok`

If you want, I can: create the Render/Heroku deployment config files, or prepare serverless endpoints for a subset of routes. Tell me which backend host you'd like and I’ll prepare the exact steps and any config files.
