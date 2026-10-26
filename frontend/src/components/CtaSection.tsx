import { useState } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import './CtaSection.css';

interface CtaSectionProps {
  onOpenLogin?: () => void;
}

export default function CtaSection({ onOpenLogin }: CtaSectionProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const scrollToConverter = () => {
    const el = document.getElementById('converter');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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
    <section id="cta" className="cta-section" aria-label="Get started with PlaylistIQ">
      {/* Timmo style graphic grid overlay */}
      <div className="cta-grid-lines" aria-hidden="true" />
      <div className="cta-ambient-glow" aria-hidden="true" />

      <div className="cta-container">
        <h2 className="cta-headline">
          Ready to connect all your playlists at one endpoint?
        </h2>
        <p className="cta-sub">
          Paste any playlist URL above to transfer tracks across Spotify, Apple Music, and YouTube Music with direct native playback.
        </p>

        {/* Action Buttons Row (Timmo style) */}
        <div className="cta-buttons-row">
          <button
            type="button"
            className="cta-primary-btn"
            onClick={scrollToConverter}
          >
            <span>Convert a playlist</span>
            <ArrowUpRight size={16} weight="bold" />
          </button>

          {onOpenLogin && (
            <button
              type="button"
              className="cta-secondary-btn"
              onClick={onOpenLogin}
            >
              <span>Open Workspace</span>
            </button>
          )}
        </div>

        {/* Optional update notification input */}
        <form onSubmit={handleSubscribe} className="cta-update-form" aria-label="Subscribe to feature updates">
          <div className="cta-update-input-wrapper">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email for new platform updates..."
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

        <p className="cta-guarantee-note">
          Free to use · No payment details required · Instant cross platform transfer
        </p>
      </div>
    </section>
  );
}
