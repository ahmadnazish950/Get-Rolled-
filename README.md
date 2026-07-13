# 🎞️ Roll — AI Photo Captioner
 
Upload a photo, let AI write the caption, and drop it into a darkroom-themed feed. **Roll** is a full-stack app where **Gemini** generates captions, **ImageKit** stores images, and **MongoDB** stores posts — wrapped in a film-lab UI that treats every post like a numbered frame on a roll of film.
 
---
 
## ✨ Features
 
- 📸 Upload a photo and get an AI-generated caption (Gemini)
- 🗂️ Persistent feed of posts stored in MongoDB, newest first
- 👤 Register / log in with cookie-based JWT auth, session persists on refresh
- 🎞️ Film-lab visual theme — numbered frames, sprocket-hole rails, a "developing" animation on new uploads before the caption types itself out
- 📱 Fully responsive — film-strip brand panel collapses on mobile, composer becomes a bottom sheet
- ⌨️ Visible keyboard focus states on all interactive elements
---
 
## 🧱 Tech Stack
 
**Backend**
- Express
- MongoDB
- JWT (cookie-based auth)
- Gemini API (caption generation)
- ImageKit (image storage/CDN)
**Frontend**
- React (Vite)
- Tailwind CSS v4
- React Router
- Context API (state management)
- Framer Motion (animations)
- Fonts: Space Grotesk, Inter, IBM Plex Mono
---
 
## 📁 Project Structure
 
```
roll/
├── backend/     # Express API — auth, posts, uploads
└── frontend/    # React app — Vite + Tailwind v4 + Context API
```
 
---
 
## 🔧 Backend
 
The original zip shipped with register / log in / create-post endpoints only. The following were added so a real frontend has what it needs to function:
 
| Change | Details |
|---|---|
| `GET /api/post` | Returns all posts, newest first, each with the poster's username populated |
| `GET /api/auth/me` | Returns the logged-in user based on the auth cookie — keeps sessions alive on refresh |
| `POST /api/auth/logout` | Clears the auth cookie |
| 🐛 Auth bug fix | `login` signed the JWT as `{ _id }` while the auth middleware read `decoded.id` — logins were silently failing auth on protected routes. Fixed. |
| 🧯 Error handling | Controllers wrapped in try/catch so a bad request returns a proper error response instead of crashing the server |
| ⚙️ Config | CORS origin and port are now configurable via env vars (`CLIENT_URL`, `PORT`) to support deploying frontend and backend separately |
 
### API Endpoints
 
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a new user |
| POST | `/api/auth/login` | Log in, sets auth cookie |
| POST | `/api/auth/logout` | Clear auth cookie |
| GET | `/api/auth/me` | Get current logged-in user |
| POST | `/api/post` | Create a new post (upload photo, generates AI caption) |
| GET | `/api/post` | Get all posts, newest first |
 
### Setup
 
```bash
cd backend
npm install
npm run dev   # or: node server.js
```
 
Runs on `http://localhost:3000`.
 
Requires a `.env` file in `backend/` with:
 
```
MONGO_URL=...
JWT_SECRET=...
GEMINI_API_KEY=...
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_URL_ENDPOINT=...
CLIENT_URL=http://localhost:5173
PORT=3000
```
 
> ⚠️ **Rotate your keys.** If your `.env` has ever passed through an upload, chat, screenshot, or shared drive, treat the Gemini and ImageKit credentials in it as exposed and regenerate them from the Google AI Studio and ImageKit dashboards before deploying anywhere real.
 
---
 
## 💻 Frontend
 
### Setup
 
```bash
cd frontend
npm install
npm run dev
```
 
Runs on `http://localhost:5173`.
 
Create `frontend/.env`:
 
```
VITE_API_URL=http://localhost:3000/api
```
 
---
 
## 🎨 Design
 
A dark "darkroom" theme — near-black background, amber and safelight-red accents, Space Grotesk for display type, Inter for body text, IBM Plex Mono for metadata/timestamps.
 
The whole UI leans on a **film-roll metaphor**:
- Posts render as numbered frames with sprocket-hole rails, like negatives on a strip
- A new upload plays a "developing" animation before its AI caption types itself out, frame by frame
- Fully responsive: the film-strip brand panel collapses on mobile, the composer becomes a bottom sheet, and all interactive elements have visible keyboard focus states
---
 
## 🚀 Running Locally (Quick Start)
 
```bash
# Terminal 1 — backend
cd backend
npm install
npm run dev
 
# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```
 
Then open `http://localhost:5173`.
 
---
 
## 🔐 Security Notes
 
- Auth uses HTTP-only cookies with a signed JWT
- Rotate any API keys that shipped in a shared `.env`
- Keep `CLIENT_URL` restricted to your actual frontend origin in production CORS config
---
 
## 📄 License
 
Add your license of choice here (MIT, ISC, etc.).
