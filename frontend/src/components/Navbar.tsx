import { useEffect, useState, useCallback } from 'react';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home', id: 'home' },
  { label: 'Converter', id: 'converter' },
  { label: 'Benefits', id: 'features' },
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Leaderboard', id: 'playlists' },
  { label: 'FAQ', id: 'faq' },
];

// IDs observed for scroll-spy (superset of nav links)
const OBSERVED_SECTIONS = ['home', 'converter', 'problem-solution', 'features', 'how-it-works', 'playlists', 'top-playlists', 'tagline', 'faq', 'cta'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  // Navbar background on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll-spy — highlight nav item matching current section in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -60% 0px' }
    );

    OBSERVED_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll helper
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }, []);

  // Escape closes mobile menu
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (id: string) =>
    id === 'home' ? activeSection === 'home' : activeSection === id;

  return (
    <>
      <nav
        id="main-nav"
        className={`liquid-nav ${scrolled ? 'scrolled' : ''}`}
        aria-label="Primary navigation"
      >
        <div className="liquid-nav-container">
          {/* Logo */}
          <button
            className="nav-logo-pill"
            onClick={() => scrollTo('home')}
            aria-label="PlaylistIQ — go to top"
          >
            <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="9" fill="#FF5500" />
              <path d="M12 24 L24 12 M24 12 H15 M24 12 V21" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Desktop nav links */}
          <div className="nav-links-pill" role="list">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                role="listitem"
                className={`nav-item ${isActive(link.id) ? 'active' : ''}`}
                onClick={() => scrollTo(link.id)}
                aria-current={isActive(link.id) ? 'page' : undefined}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right: CTA + hamburger */}
          <div className="nav-right">
            <button className="nav-action-btn" onClick={() => scrollTo('converter')}>
              Convert playlist
            </button>
            <button
              className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="nav-mobile-panel"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-height slide panel */}
      <div
        id="nav-mobile-panel"
        className={`nav-mobile-panel ${menuOpen ? 'open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav className="nav-mobile-links" aria-label="Mobile navigation">
          {NAV_LINKS.map((link, i) => (
            <button
              key={link.id}
              className="nav-mobile-item"
              style={{ transitionDelay: menuOpen ? `${80 + i * 60}ms` : '0ms' }}
              onClick={() => scrollTo(link.id)}
            >
              {link.label}
            </button>
          ))}
          <button
            className="nav-mobile-cta"
            style={{ transitionDelay: menuOpen ? `${80 + NAV_LINKS.length * 60}ms` : '0ms' }}
            onClick={() => scrollTo('converter')}
          >
            Convert playlist
          </button>
        </nav>
      </div>

      {/* Scrim */}
      <div
        className={`nav-mobile-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
