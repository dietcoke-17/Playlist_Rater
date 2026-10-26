# Playlitfy

> Your Music, Your Way

Playlitfy is a high performance music ecosystem combining a universal playlist converter with an authorized public community curation directory and transparent consensus scoring. It empowers listeners to freely move their playlists across major streaming services while discovering music shared by verified curators who authorized public display.

---

## Core Capabilities

### 1. Universal Playlist Converter
* Automatic platform detection from playlist URL
* Cross catalog matching for Spotify, Apple Music, YouTube Music, TIDAL, and Amazon Music
* Track count and duration metrics with instant transfer preview
* One click native app launching for converted playlists

### 2. Public Curators and Community Directory (`/curators`)
* Dedicated public directory featuring verified curators who authorized public display of their music
* Category filtering across curated genres: Lo Fi Chill, City Pop and Funk, Neo Classical, Deep House and Club, Hip Hop and Soul, Alt Pop and Acoustic
* Instant, non blocking search across playlists, curators, tracks, and artists powered by React 19 concurrent state (`useDeferredValue`)
* Authentic Spotify style cards with floating play actions and track inspection

### 3. Interactive 1 to 10 Community Rating System
* Pure 1 to 10 consensus rating scale on every playlist card and inspection modal
* Real time score updates with instant local storage persistence
* Transparent score distribution preventing algorithmic bias

### 4. In Playlist Inspection Modal
* Deep inspection of complete tracklists, duration, and catalog match rates
* Embedded audio player previews with animated waveform equalizer bars
* Direct conversion dropdown to recreate the inspected playlist on Apple Music, Spotify, YouTube Music, Amazon Music, or TIDAL

### 5. Creator Publishing Portal
* Dedicated submission workflow for curators and listeners to share playlists
* Mandatory verified authorization checkbox ensuring creator consent for public display and community rating
* Instant addition to the local community directory

### 6. Top Ranked Leaderboard
* Sortable rankings chart showcasing the highest rated community playlists across all streaming services
* Transparent community scores, genre badges, and direct play actions

---

## Architecture and Design System

* **Visual Identity:** Curated Timmo theme featuring a deep `#000000` canvas, subtle 56px grid lines, and high contrast black and white branding
* **Typography:** Single approved typeface (`Manrope`) across all headings, metrics, and body copy
* **60fps Performance:** CSS containment (`contain: layout style`), hardware accelerated compositing (`transform: translateZ(0)`), off screen content virtualization (`content-visibility: auto`), async image decoding, and zero mask rasterization overhead
* **Pure Styling:** 100% Vanilla CSS design system with custom CSS variables, eliminating heavy CSS utility runtimes

---

## Repository Structure

```text
Playlist_Rater/
├── frontend/             # Single page web application (React 19 + TypeScript + Vite)
│   ├── public/           # Static assets, logos, and Open Graph previews
│   ├── src/
│   │   ├── components/   # Modular, token compliant UI components
│   │   │   ├── Navbar.tsx            # Floating Timmo capsule navigation
│   │   │   ├── Hero.tsx              # Universal Converter and directory gateway
│   │   │   ├── PopularPage.tsx       # Dedicated Public Curators and Community Directory
│   │   │   ├── PopularPage.css       # 60fps optimized directory stylesheet
│   │   │   ├── LeaderboardPage.tsx   # Ranked community leaderboards
│   │   │   ├── LoginPage.tsx         # Streaming auth portal
│   │   │   └── Footer.tsx            # Minimal footer with navigation anchors
│   │   ├── data/         # Authentic community playlists and curator data models
│   │   ├── context/      # Authentication context provider
│   │   ├── App.tsx       # Application router and smooth scroll orchestrator
│   │   ├── main.tsx      # Application entrypoint
│   │   └── index.css     # Global design system tokens and reset rules
│   ├── index.html        # Semantic HTML shell
│   ├── package.json      # Frontend dependencies and build scripts
│   ├── vite.config.ts    # Vite bundler configuration
│   └── vercel.json       # Frontend Vercel routing configuration
├── package.json          # Monorepo workspaces definition and root task delegation
├── vercel.json           # Root Vercel monorepo deployment configuration
└── README.md             # Project documentation and architecture guide
```

---

## Quick Start

### Prerequisites
* Node.js 18+ (tested on Node.js 20 and 22)
* npm 9+

### Running Locally

From the repository root:
```bash
npm run dev
```

Or from the `frontend/` directory:
```bash
cd frontend
npm run dev
```

The application will be accessible at: `http://localhost:5173/`

### Validation and Production Build

From the repository root:
```bash
# Run oxlint across all TypeScript and React files
npm run lint

# Compile TypeScript and generate the production bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## Deployment (Vercel)

This repository is preconfigured for zero configuration Vercel deployments as a monorepo workspace.

* **Build Command:** `npm --prefix frontend install && npm --prefix frontend run build`
* **Output Directory:** `frontend/dist`
* **SPA Routing:** Configured with catch all rewrites directing all paths (`/curators`, `/popular`, `/leaderboard`, `/login`) to `/index.html`
