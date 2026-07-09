# Roll — AI photo captioner

A full-stack app: upload a photo, an AI (Gemini) writes the caption, ImageKit stores the image, MongoDB stores the post. Frontend is React + Context API, styled as a film-lab/darkroom themed feed ("Roll").

## Structure
- `backend/` — your original Express API (register/login/upload), with two small additions (see below)
- `frontend/` — new React app (Vite + Tailwind v4 + React Router + Context API + Framer Motion)

## What I changed in the backend
Your zip only had endpoints to register, log in, and create a post — nothing to fetch the feed or check who's logged in, both of which a real frontend needs. I added:
- `GET /api/post` — returns all posts (newest first), each with the poster's username populated
- `GET /api/auth/me` — returns the logged-in user based on the auth cookie (used to keep you logged in on refresh)
- `POST /api/auth/logout` — clears the auth cookie
- Fixed a bug where `login` signed the JWT as `{ _id }` but the auth middleware read `decoded.id` — logins were silently failing auth on protected routes before this fix
- Wrapped controllers in try/catch so a bad request returns a real error instead of crashing the server
- Made the CORS origin and port configurable via env vars (`CLIENT_URL`, `PORT`) for deploying separately from localhost

## Run it

### Backend
```
cd backend
npm install
npm run dev   # or: node server.js
```
Runs on `http://localhost:3000`. Needs the `.env` already in the folder (Mongo URL, JWT secret, Gemini key, ImageKit keys).

⚠️ **Rotate those keys.** The `.env` in your zip has live-looking Gemini and ImageKit credentials. Since this file has now passed through an upload, treat those as exposed and regenerate them from the Google AI Studio and ImageKit dashboards.

### Frontend
```
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`. Configure the API location in `frontend/.env`:
```
VITE_API_URL=http://localhost:3000/api
```

## Design
Dark "darkroom" theme (near-black background, amber/safelight-red accents, Space Grotesk + Inter + IBM Plex Mono) built around the film-roll metaphor: posts are numbered frames with sprocket-hole rails, and a new upload plays a "developing" animation before its AI caption types itself out. Fully responsive — the film-strip brand panel collapses on mobile, the composer becomes a bottom sheet, and all interactive elements have visible keyboard focus states.
