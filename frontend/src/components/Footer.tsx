import { useState, useEffect } from 'react';
import './Footer.css';

interface FooterProps {
  onOpenCurators?: () => void;
}

export default function Footer({ onOpenCurators }: FooterProps) {
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
              aria-label="Playlitfy, go to top"
            >
              <div className="footer-logo-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect width="24" height="24" rx="6" fill="#FFFFFF" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M7 5H13.5C16.5 5 18.5 7 18.5 10C18.5 13 16.5 15 13.5 15H10V19H7V5ZM10 8V12H13C14.2 12 15.2 11.2 15.2 10C15.2 8.8 14.2 8 13 8H10Z" fill="#000000" />
                </svg>
              </div>
              <span className="footer-brand-name">Playlitfy</span>
            </button>
            <p className="footer-tagline">
              Your music your way. The universal cross platform playlist hub and community rating platform.
            </p>
          </div>

          <nav className="footer-nav-links" aria-label="Footer links">
            <button type="button" className="footer-nav-btn" onClick={() => scrollTo('converter')}>
              Converter
            </button>
            {onOpenCurators && (
              <button type="button" className="footer-nav-btn" onClick={onOpenCurators}>
                Public Curators
              </button>
            )}
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
            © {new Date().getFullYear()} Playlitfy. Not affiliated with Spotify, Apple, or Google. All rights reserved.
          </p>
          <div className="footer-status-pill">
            <span className="status-indicator" aria-hidden="true" />
            <span>Universal connection endpoints active</span>
          </div>
        </div>
      </div>

      {/* Accessible Legal Modal Dialog */}
      {activeModal && (
        <div
          className="legal-modal-backdrop"
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
                className="legal-modal-close"
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
                    <strong>Effective date:</strong> October 2026.
                  </p>
                  <p>
                    Playlitfy values your privacy. We collect only information required to provide community playlist rating, cross platform recreation, and leaderboard rankings.
                  </p>
                  <p>
                    <strong>Library access:</strong> When you connect Spotify, Apple Music, or YouTube Music accounts, Playlitfy requests read only access to fetch public and saved playlist metadata (titles, track counts, and cover images). We never alter, overwrite, or sell your listening data.
                  </p>
                  <p>
                    <strong>Analytics:</strong> All scores are aggregated into public community consensus metrics without storing personal listening timestamps.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Effective date:</strong> October 2026.
                  </p>
                  <p>
                    By accessing or using Playlitfy, you agree to these Terms of Service.
                  </p>
                  <p>
                    <strong>Community guidelines:</strong> Ratings must represent genuine human evaluation. Attempted vote brigading or automated scraping is prohibited and will result in immediate exclusion from the leaderboard.
                  </p>
                  <p>
                    <strong>Intellectual property:</strong> All playlist titles and cover assets belong to their respective creators and streaming platforms. Playlitfy is an independent rating directory and cross platform bridge.
                  </p>
                </>
              )}
            </div>
            <div className="legal-modal-footer">
              <button
                type="button"
                className="legal-modal-confirm-btn"
                onClick={() => setActiveModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
