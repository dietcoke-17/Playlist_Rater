import { useState, useEffect } from 'react';
import './Footer.css';

export default function Footer() {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    if (activeModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeModal]);

  return (
    <footer className="footer-root" role="contentinfo" aria-label="Site footer">
      <div className="footer-container">
        {/* Top Footer Row: Brand and Navigation */}
        <div className="footer-main-row">
          <div className="footer-brand-box">
            <button
              className="footer-logo-btn"
              onClick={() => scrollTo('home')}
              aria-label="PlaylistIQ, go to top"
            >
              <div className="footer-logo-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect width="24" height="24" rx="6" fill="#FF5733" />
                  <path d="M7 17L17 7M17 7H9M17 7V15" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="footer-brand-name">PlaylistIQ</span>
            </button>
            <p className="footer-tagline">
              The independent community rating platform for music playlists.
            </p>
          </div>

          <nav className="footer-nav-links" aria-label="Footer links">
            <button type="button" className="footer-nav-btn" onClick={() => scrollTo('problem-solution')}>
              The problem
            </button>
            <button type="button" className="footer-nav-btn" onClick={() => scrollTo('features')}>
              Benefits
            </button>
            <button type="button" className="footer-nav-btn" onClick={() => scrollTo('how-it-works')}>
              How it works
            </button>
            <button type="button" className="footer-nav-btn" onClick={() => scrollTo('playlists')}>
              Leaderboard
            </button>
            <button type="button" className="footer-nav-btn" onClick={() => scrollTo('faq')}>
              FAQ
            </button>
            <button
              type="button"
              className="footer-nav-btn footer-legal-btn"
              onClick={() => setActiveModal('privacy')}
              aria-haspopup="dialog"
            >
              Privacy policy
            </button>
            <button
              type="button"
              className="footer-nav-btn footer-legal-btn"
              onClick={() => setActiveModal('terms')}
              aria-haspopup="dialog"
            >
              Terms of service
            </button>
          </nav>
        </div>

        {/* Bottom Disclaimer & Copyright Row */}
        <div className="footer-bottom-row">
          <p className="footer-copyright">
            © {new Date().getFullYear()} PlaylistIQ. Not affiliated with Spotify AB. All rights reserved.
          </p>
          <div className="footer-status-pill">
            <span className="status-indicator" aria-hidden="true" />
            <span>All voting systems operational</span>
          </div>
        </div>
      </div>

      {/* Accessible Legal Modal Dialog */}
      {activeModal && (
        <div
          className="legal-modal-overlay"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
        >
          <div
            className="legal-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="legal-modal-header">
              <h3 id="legal-modal-title" className="legal-modal-title">
                {activeModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h3>
              <button
                type="button"
                className="legal-modal-close-btn"
                onClick={() => setActiveModal(null)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="legal-modal-body">
              {activeModal === 'privacy' ? (
                <>
                  <p>
                    <strong>1. Information We Collect:</strong> When you link your Spotify account, we request read-only access to your public playlists and username. We never collect payment information or private listening history.
                  </p>
                  <p>
                    <strong>2. How We Use Data:</strong> Community votes and playlist metadata are aggregated to build democratic rankings and calculate transition harmony scores. We do not sell personal data to third party advertisers.
                  </p>
                  <p>
                    <strong>3. Your Rights:</strong> You can disconnect your library at any time from your settings or directly within your Spotify account application permissions.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>1. Community Guidelines:</strong> Playlist ratings must reflect genuine listener impressions. Vote manipulation, automated botting, and commercial extortion are strictly prohibited and result in permanent disqualification.
                  </p>
                  <p>
                    <strong>2. Intellectual Property:</strong> Playlist names, descriptions, and curation order belong to their respective curators. Spotify trademarks and artist catalog metadata remain the property of their respective owners.
                  </p>
                  <p>
                    <strong>3. Service Availability:</strong> PlaylistIQ is provided as an independent community tool without commercial warranty.
                  </p>
                </>
              )}
            </div>

            <div className="legal-modal-footer">
              <button
                type="button"
                className="legal-modal-done-btn"
                onClick={() => setActiveModal(null)}
              >
                I understand
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
