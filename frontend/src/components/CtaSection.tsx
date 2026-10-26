import { useState } from 'react';
import './CtaSection.css';

export default function CtaSection() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 6000);
  };

  return (
    <section id="cta" className="cta-section" aria-label="Join early access">
      <div className="cta-container">
        <div className="pill-badge pill-badge--dark">
          <span className="badge-dot dot-green" aria-hidden="true" /> Early access open
        </div>

        <h2 className="cta-headline">
          Ready to connect all your playlists at one endpoint?
        </h2>
        <p className="cta-sub">
          Join over 14,000 curators and listeners syncing playlists across Spotify, Apple Music, and YouTube Music without walled gardens or algorithmic distortion.
        </p>

        <form className="cta-form-wrapper" onSubmit={handleSubmit} aria-label="Request early access" noValidate>
          <div className="cta-input-group">
            <input
              type="email"
              className={`cta-email-input ${error ? 'cta-email-input--error' : ''}`}
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              aria-label="Email address"
              aria-describedby={error ? 'cta-form-error' : undefined}
              required
            />
            <button
              type="submit"
              className={`cta-submit-btn ${submitted ? 'cta-submit-btn--success' : ''}`}
              disabled={submitted}
            >
              {submitted ? '✓ You are on the list' : 'Get early access'}
            </button>
          </div>

          {error && (
            <p id="cta-form-error" className="cta-form-error" role="alert">
              {error}
            </p>
          )}

          {submitted && (
            <p className="cta-form-success" role="status">
              Welcome aboard. We will send you an invite to convert and rate your first playlist shortly.
            </p>
          )}
        </form>

        <p className="cta-guarantee-note">
          Free forever · No credit card required · Instant cross platform library sync
        </p>
      </div>
    </section>
  );
}
