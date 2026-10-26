import { useState } from 'react';
import './Sections.css';

export default function CtaSection() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 5000);
  };

  return (
    <section id="cta" className="section section--dark section--cta">
      <div className="section-inner section-inner--cta">
        <h2 className="cta-headline">
          Ready to find your next<br />favourite playlist?
        </h2>
        <p className="cta-sub">
          Join the early access list. It's free and works with the Spotify account you already have.
        </p>

        <form className="cta-form" onSubmit={handleSubmit} aria-label="Request early access" noValidate>
          <input
            type="email"
            className={`cta-input ${error ? 'cta-input--error' : ''}`}
            placeholder="Your email address"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            aria-label="Email address"
            aria-describedby={error ? 'cta-form-error' : undefined}
          />
          <button
            type="submit"
            className={`btn btn--primary btn--large ${submitted ? 'btn--success' : ''}`}
          >
            {submitted ? '✓ You\'re on the list!' : 'Get early access'}
          </button>
        </form>

        {error && (
          <p id="cta-form-error" className="cta-form-error" role="alert">{error}</p>
        )}

        <p className="cta-note">No credit card · No new account · Just your email</p>
      </div>
    </section>
  );
}
