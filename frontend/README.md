# Playlitfy — Frontend

This directory contains the client-side single page application for **Playlitfy** (*your music your way*), built with React 19, TypeScript, and Vite.

## Tech Stack
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Smooth Scroll:** Lenis
- **Animations:** GSAP 3 (ScrollTrigger)
- **Icons:** Phosphor Icons React
- **Linter:** Oxlint

## Development Scripts
- `npm run dev`: Launch local Vite dev server at `http://localhost:5173/`
- `npm run build`: Type-check with `tsc -b` and produce production build in `dist/`
- `npm run lint`: Run Oxlint on all `.ts` and `.tsx` source files
- `npm run preview`: Preview the production bundle locally

## Directory Breakdown
- `src/components/`: Core landing page components and their respective stylesheets.
- `src/data/`: Static mock playlists and customer reviews data.
- `src/hooks/`: Custom animation and IntersectionObserver hooks.
- `public/`: Brand assets including `favicon.svg` and `og-image.png`.
