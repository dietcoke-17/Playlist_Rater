# PlaylistIQ

PlaylistIQ is an independent, community-driven rating and discovery platform for music playlists. It replaces black-box recommendation algorithms with human curation, weighted consensus scoring, and real-time audio analytics.

---

## Repository Structure

```text
Playlist_Rater/
├── frontend/             # Single-Page Web Application (React 19 + TypeScript + Vite)
│   ├── public/           # Static assets (favicons, Open Graph previews)
│   ├── src/
│   │   ├── components/   # Modular, token-compliant landing page sections
│   │   ├── data/         # Authentic playlist & reviewer data models
│   │   ├── hooks/        # In-view and intersection observer hooks
│   │   ├── App.tsx       # Single-page layout with Lenis + GSAP ScrollTrigger
│   │   ├── main.tsx      # Application entrypoint
│   │   └── index.css     # Global design system & typography tokens
│   ├── index.html        # Semantic HTML shell with AEO / FAQPage JSON-LD schema
│   ├── package.json      # Frontend dependencies & scripts
│   └── vite.config.ts    # Vite bundler configuration
├── package.json          # Root workspace scripts delegating to frontend
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 18+ (tested with Node.js 20 & 24)
- npm 9+

### Running the Frontend

From the repository root:
```bash
npm run dev
```

Or directly inside the `frontend/` directory:
```bash
cd frontend
npm run dev
```

The application will be accessible at: `http://localhost:5173/`

### Linting & Production Build

From repository root:
```bash
# Run oxlint across all TypeScript and React files
npm run lint

# Compile TypeScript and generate the production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Frontend Architecture & Features
- **Design System:** Strictly compliant with the modern dark aesthetic tokens (`#000000`, `#181818`, `#1F1F1F`), custom orange brand accents (`#FF5500`), nested border radii, and single typography (`Manrope`).
- **Smooth Scrolling & Motion:** Integrated Lenis smooth scroll synchronized with GSAP `ScrollTrigger` and respecting `prefers-reduced-motion`.
- **Key Sections:**
  1. **Hero**: Interactive animated track row and proof metrics strip.
  2. **Problem vs. Solution**: Progressive word illumination on scroll.
  3. **Benefits**: Interactive Community Score vs. Algorithm comparator card and outcome modules.
  4. **How It Works**: 3-step interactive timeline with active states.
  5. **Product Proof**: Filterable playlist leaderboards across 6 genres and verified listener reviews.
  6. **Tagline Reveal**: Word-by-word deceleration scroll curve.
  7. **FAQ**: Accessible accordion handling core objections with JSON-LD schema.
  8. **CTA & Early Access**: Validated email capture form with live feedback.
  9. **Footer**: Navigation anchors and accessible Privacy Policy & Terms modals.
