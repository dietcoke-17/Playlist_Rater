import React, { useState } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import { BackgroundBeams } from './aceternity/BackgroundBeams';
import './CtaSection.css';

interface CtaSectionProps {
  onOpenLogin?: () => void;
}

export default function CtaSection({ onOpenLogin }: CtaSectionProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const scrollToConverter = () => {
    const el = document.getElementById('converter');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 5000);
  };

  return (
    <section id="cta" className="cta-section" aria-label="Get started with Playlitfy">
      {/* Studio Background Beams */}
      <BackgroundBeams />

      {/* Studio Graphic Grid Overlay */}
      <div className="cta-grid-lines" aria-hidden="true" />
      <div className="cta-ambient-glow" aria-hidden="true" />

      <div className="cta-container">
        <div className="cta-badge-pill">
          <span>06 // UNIVERSAL PROTOCOL</span>
        </div>

        <h2 className="cta-headline">
          Ready to unlock every playlist across your music ecosystem?
        </h2>
        <p className="cta-sub">
          Paste any Spotify, Apple Music, or YouTube Music URL to instantly transfer tracks with lossless ISRC matching and direct native app launch.
        </p>

        {/* Studio Action Buttons Row */}
        <div className="cta-buttons-row">
          <button
            type="button"
            className="cta-primary-btn"
            onClick={scrollToConverter}
          >
            <span>Convert a Playlist Now</span>
            <ArrowUpRight size={15} weight="bold" />
          </button>

          {onOpenLogin && (
            <button
              type="button"
              className="cta-secondary-btn"
              onClick={onOpenLogin}
            >
              <span>Open Music Workspace</span>
            </button>
          )}
        </div>

        {/* Studio Email Notification Form */}
        <form onSubmit={handleSubscribe} className="cta-update-form" aria-label="Subscribe to updates">
          <div className="cta-update-input-wrapper">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email for platform & ISRC updates..."
              className="cta-update-input"
              required
            />
            <button
              type="submit"
              disabled={submitted || !email.trim()}
              className="cta-update-btn"
            >
              {submitted ? 'Subscribed' : 'Notify me'}
            </button>
          </div>
          {submitted && (
            <p className="cta-success-msg" role="status">
              You will receive updates when new streaming integrations launch.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
