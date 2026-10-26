import './Sections.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <rect width="40" height="40" rx="10" fill="#FF5733" />
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontFamily="Manrope" fontWeight="700" fontSize="18">P</text>
          </svg>
          <span>PlaylistIQ</span>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}>How it works</a>
          <a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>Features</a>
          <a href="#top-playlists" onClick={(e) => { e.preventDefault(); document.getElementById('top-playlists')?.scrollIntoView({ behavior: 'smooth' }); }}>Top playlists</a>
          <a href="#faq" onClick={(e) => { e.preventDefault(); document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }); }}>FAQ</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>

        <p className="footer-copy">
          © {new Date().getFullYear()} PlaylistIQ. Not affiliated with Spotify AB. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
