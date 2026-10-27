# Playlitfy Backend API

Full-featured REST backend for **Playlitfy** built with **Express**, **TypeScript**, and **Firebase Cloud Functions**, backed by **Supabase PostgreSQL**.

---

## 🚀 Features

1. **Spotify OAuth & Account Sync**:
   - Spotify Authorisation Code Flow with PKCE/secret support.
   - Secure server-signed JWTs (`/api/v1/auth/me`).
   - Automated token refresh.
2. **Public Spotify Playlist Fetching**:
   - Fetches any public Spotify playlist without requiring end-user authentication using Spotify Client Credentials.
   - Normalises track metadata, album art, ISRC codes, and duration.
   - Paginates user public libraries up to 200 playlists.
3. **Cross-Service Music Conversion Engine**:
   - Universal conversion from Spotify to **Apple Music**, **YouTube Music**, **TIDAL**, and **Amazon Music**.
   - Builds deep-links and web URLs based on track metadata, ISRC codes, and verified catalog search heuristics.
4. **Curator Directory with Verified Consent**:
   - Public directory of community curators with genre filters, search, and sorting.
   - Curators can explicitly opt in (`/api/v1/curators/opt-in`) or opt out (`/api/v1/curators/opt-out`).
   - Curators can publish playlists to the directory (`/api/v1/playlists`) with verified permission flags (`is_curator_approved: true`).
5. **Community Ratings & Leaderboards**:
   - Transparent 1–10 community score submissions (`/api/v1/ratings/:playlistId`).
   - Anti-gaming fingerprinting/IP deduplication with score updates.
   - Global leaderboard of top-rated curations.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.6
- **Server**: Express 4.21
- **Database**: Supabase (PostgreSQL 15) with RLS policies and automatic recalculation triggers
- **Deployment**: Firebase Cloud Functions v1/v2 or standalone Node.js container/server

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── index.ts               # Firebase Cloud Functions HTTPS export (`api`)
│   ├── server.ts              # Local standalone Express server (`npm run dev`)
│   ├── app.ts                 # Express configuration, CORS, and route mounting
│   ├── middleware/
│   │   ├── errorHandler.ts    # Global error handler with upstream Spotify sanitisation
│   │   └── requireAuth.ts     # JWT validation middleware
│   ├── routes/
│   │   ├── auth.ts            # Spotify OAuth (/auth/spotify, /auth/callback, /auth/me)
│   │   ├── spotify.ts         # Public Spotify playlist & user playlist fetching
│   │   ├── convert.ts         # Cross-platform deep-link conversion engine
│   │   ├── curators.ts        # Public curator directory & opt-in/opt-out
│   │   ├── playlists.ts       # Curator playlist management & library sync
│   │   └── ratings.ts         # Community 1–10 voting & global leaderboard
│   └── lib/
│       ├── spotify.ts         # Spotify Web API client (Client Credentials + User Auth)
│       ├── converter.ts       # Universal deep-link generator for streaming services
│       ├── supabase.ts        # Supabase PostgreSQL client
│       └── jwt.ts             # JWT signing and verification
├── schema.sql                 # Supabase PostgreSQL schema with triggers & RLS
├── firebase.json              # Firebase Functions deployment configuration
├── .firebaserc                # Firebase project ID
├── .env.example               # Template of required environment variables
├── package.json
└── tsconfig.json
```

---

## ⚙️ Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your credentials:
   - **Spotify Developer Dashboard**: Create an app and set Redirect URI to `http://localhost:5001/api/v1/auth/callback` (or Firebase function URL).
     - `SPOTIFY_CLIENT_ID`
     - `SPOTIFY_CLIENT_SECRET`
     - `SPOTIFY_REDIRECT_URI`
   - **Supabase**: Create a project and run `schema.sql` in the Supabase SQL Editor.
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY` (or anon key)
   - **JWT**:
     - `JWT_SECRET` (generate with `openssl rand -base64 32`)
   - **Frontend URL**:
     - `FRONTEND_URL=http://localhost:5173`

---

## 🏃 Running the Backend

### Local Express Server (Recommended for local dev)
```bash
npm run dev
```
Server starts on `http://localhost:5001` with zero emulator overhead.

### Firebase Emulator
```bash
npm run serve
```

### Deploy to Firebase Cloud Functions
```bash
npm run deploy
```

---

## 📖 API Reference

### 1. Health Check
- `GET /api/v1/health`
  - Response: `{ status: "ok", ts: "..." }`

### 2. Spotify OAuth
- `GET /api/v1/auth/spotify` — Redirects user to Spotify login.
- `GET /api/v1/auth/callback?code=...` — Exchanges Spotify auth code for tokens and redirects to `${FRONTEND_URL}/login?token=<jwt>`.
- `GET /api/v1/auth/me` — Returns current authenticated user (Bearer token required).
- `POST /api/v1/auth/logout` — Revokes session.

### 3. Public Spotify Playlist
- `GET /api/v1/spotify/playlist?url=https://open.spotify.com/playlist/...`
  - Fetches any public playlist using client credentials.
  - Returns title, description, coverImage, curator details, and track list with duration and preview URLs.
- `GET /api/v1/spotify/users/:spotifyUserId/playlists`
  - Fetches public playlists created by a Spotify user.

### 4. Converter Engine
- `POST /api/v1/convert`
  - Body: `{ "url": "https://open.spotify.com/playlist/...", "target": "all" | "Apple Music" | "YouTube Music" | "TIDAL" | "Amazon Music" }`
  - Returns normalized playlist and cross-service deep links.
- `GET /api/v1/convert/link?title=...&artist=...&target=...`
  - Generates cross-service search deep-link for a single track.

### 5. Curators Directory
- `GET /api/v1/curators?genre=...&search=...&sort=rating|followers|newest&page=1&limit=24`
  - Returns paginated list of public curators with approved playlists and statistics.
- `POST /api/v1/curators/opt-in` *(Auth required)*
  - Opts user into public display in the curator directory.
- `POST /api/v1/curators/opt-out` *(Auth required)*
  - Opts user out of public display.
- `PUT /api/v1/curators/profile` *(Auth required)*
  - Update curator bio and genres.

### 6. Ratings & Leaderboard
- `GET /api/v1/ratings/:playlistId`
  - Returns average rating, review count, and 1–10 score distribution.
- `POST /api/v1/ratings/:playlistId`
  - Body: `{ "score": 9, "voterFingerprint": "..." }`
  - Submits a community vote (1–10 scale). Automatically dedupes and updates aggregate score.
- `GET /api/v1/ratings/leaderboard?limit=50&genre=...`
  - Returns top-rated playlists worldwide.

### 7. Playlists Management *(Auth required)*
- `GET /api/v1/playlists` — Lists the authenticated curator's synced playlists.
- `POST /api/v1/playlists` — Publishes/syncs a Spotify playlist to the directory with `allowPublic: true`.
- `POST /api/v1/playlists/:id/sync` — Re-fetches tracks and updates from Spotify.
- `DELETE /api/v1/playlists/:id` — Removes playlist from public directory.
