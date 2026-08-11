import { useEffect, useState } from 'react';
import './Navbar.css';

interface NavbarProps {
  currentRoute?: string;
}

export default function Navbar({ currentRoute = 'home' }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav id="main-nav" className={`liquid-nav ${scrolled ? 'scrolled' : ''}`} aria-label="Primary navigation">
      <div className="liquid-nav-container">
        {/* Left Logo Icon Pill */}
        <a href="#home" className="nav-logo-pill" aria-label="Playlist Rater Home">
          <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="9" fill="#FF5733" />
            <path d="M12 24 L24 12 M24 12 H15 M24 12 V21" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>

        {/* Middle Navigation Links Pill */}
        <div className="nav-links-pill">
          <a
            href="#home"
            className={`nav-item ${currentRoute === 'home' ? 'active' : ''}`}
          >
            Home
          </a>
          <a
            href="#playlists"
            className={`nav-item ${currentRoute === 'playlists' ? 'active' : ''}`}
          >
            Playlists
          </a>
          <a
            href="#top-playlists"
            className={`nav-item ${currentRoute === 'top-playlists' ? 'active' : ''}`}
          >
            Top Playlists
          </a>
          <a
            href="#faq"
            className={`nav-item ${currentRoute === 'faq' ? 'active' : ''}`}
          >
            FAQ
          </a>
        </div>

        {/* Right Action Capsule */}
        <a href="#playlists" className="nav-action-btn">
          Launch App
        </a>
      </div>
    </nav>
  );
}
