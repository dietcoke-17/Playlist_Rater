import './Sections.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <rect width="40" height="40" rx="10" fill="#1DB954" />
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontFamily="Outfit" fontWeight="800" fontSize="18">P</text>
          </svg>
          <span>PlaylistIQ</span>
        </div>

        <div className="footer-links">
          <a href="#featured">Featured</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#top-rated">Top Rated</a>
          <a href="#features">Features</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>

        <p className="footer-copy">
          © {new Date().getFullYear()} PlaylistIQ. Not affiliated with Spotify AB. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
