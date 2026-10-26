import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Converter', id: 'converter' },
  { label: 'Public Curators', id: 'curators' },
  { label: 'Leaderboard', id: 'leaderboard' },
];

const OBSERVED_SECTIONS = ['home', 'converter'];

interface NavbarProps {
  onOpenLogin?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenPopular?: () => void;
  onGoHome?: () => void;
  currentView?: 'home' | 'login' | 'leaderboard' | 'popular';
}

export default function Navbar({
  onOpenLogin,
  onOpenLeaderboard,
  onOpenPopular,
  onGoHome,
  currentView = 'home',
}: NavbarProps) {
  const { user, isLoggedIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (currentView !== 'home') return;

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
  }, [currentView]);

  const scrollTo = useCallback((id: string) => {
    if ((id === 'curators' || id === 'popular-playlists') && onOpenPopular) {
      onOpenPopular();
      setMenuOpen(false);
      return;
    }
    if ((id === 'leaderboard' || id === 'playlists') && onOpenLeaderboard) {
      onOpenLeaderboard();
      setMenuOpen(false);
      return;
    }
    if (id === 'converter') {
      if (currentView !== 'home' && onGoHome) {
        onGoHome();
      }
      setTimeout(() => {
        const el = document.getElementById('converter');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      setMenuOpen(false);
      return;
    }
    if (currentView !== 'home' && onGoHome) {
      onGoHome();
      setMenuOpen(false);
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }, [currentView, onGoHome, onOpenLeaderboard, onOpenPopular]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (id: string) => {
    if (currentView === 'popular' && (id === 'curators' || id === 'popular-playlists')) return true;
    if (currentView === 'leaderboard' && (id === 'leaderboard' || id === 'playlists')) return true;
    if (currentView === 'home' && (activeSection === id || (id === 'converter' && activeSection === 'home'))) return true;
    return false;
  };

  return (
    <>
      <nav
        id="main-nav"
        className={`liquid-nav ${scrolled ? 'scrolled' : ''}`}
        aria-label="Primary navigation"
      >
        <div className="liquid-nav-container">
          {/* Brand Logo (Crisp black and white P logo) */}
          <button
            className="nav-logo-pill"
            onClick={() => {
              if (currentView !== 'home' && onGoHome) {
                onGoHome();
              } else {
                scrollTo('home');
              }
            }}
            aria-label="Playlitfy go to top"
          >
            <svg width="26" height="26" viewBox="0 0 36 36" fill="none" aria-hidden="true">
              <rect width="36" height="36" rx="8" fill="#FFFFFF" />
              <path fillRule="evenodd" clipRule="evenodd" d="M11 8H20.5C24.5 8 27.5 11 27.5 15C27.5 19 24.5 22 20.5 22H15.5V28H11V8ZM15.5 12V18H20C21.6 18 23 16.7 23 15C23 13.3 21.6 12 20 12H15.5Z" fill="#000000" />
            </svg>
            <span className="nav-logo-name">Playlitfy</span>
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

          {/* Right side: Login Button + CTA + Hamburger */}
          <div className="nav-right">
            {/* Timmo style Login / Workspace Pill Button */}
            {isLoggedIn && user ? (
              <button
                id="nav-user-btn"
                className="nav-user-pill"
                onClick={onOpenLogin}
                title="Open Music Workspace"
              >
                <img src={user.avatar} alt={user.name} className="nav-user-avatar" />
                <span className="nav-user-name">Workspace</span>
              </button>
            ) : (
              <button
                id="nav-login-btn"
                className="nav-login-btn"
                onClick={onOpenLogin}
              >
                Login
              </button>
            )}

            <button
              className="nav-action-btn"
              onClick={() => scrollTo('converter')}
            >
              Convert
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

      {/* Mobile drawer panel */}
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
              style={{ transitionDelay: menuOpen ? `${80 + i * 50}ms` : '0ms' }}
              onClick={() => scrollTo(link.id)}
            >
              {link.label}
            </button>
          ))}

          <button
            className="nav-mobile-item login"
            style={{ transitionDelay: menuOpen ? `${80 + NAV_LINKS.length * 50}ms` : '0ms' }}
            onClick={() => {
              setMenuOpen(false);
              onOpenLogin?.();
            }}
          >
            {isLoggedIn ? 'Music Workspace' : 'Sign In / Login'}
          </button>

          <button
            className="nav-mobile-cta"
            style={{ transitionDelay: menuOpen ? `${80 + (NAV_LINKS.length + 1) * 50}ms` : '0ms' }}
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
