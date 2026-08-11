import { useState } from 'react';
import { useCounter, useInView } from '../hooks/useAnimations';
import './Sections.css';

export default function CtaSection() {
  const { ref, isInView } = useInView();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const { ref: refUsers, count: countUsers } = useCounter(14200);
  const { ref: refPlaylists, count: countPlaylists } = useCounter(48500);
  const { ref: refRatings, count: countRatings } = useCounter(230000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 4000);
  };

  return (
    <section id="cta" className="section section--dark section--cta" ref={ref}>
      <div className="section-inner section-inner--cta">
        {/* Stats */}
        <div className={`cta-stats ${isInView ? 'revealed' : ''}`}>
          <div className="stat-item" ref={refUsers}>
            <div className="stat-number">{countUsers.toLocaleString()}+</div>
            <div className="stat-label">Active Curators</div>
          </div>
          <div className="stat-item" ref={refPlaylists}>
            <div className="stat-number">{countPlaylists.toLocaleString()}+</div>
            <div className="stat-label">Playlists Rated</div>
          </div>
          <div className="stat-item" ref={refRatings}>
            <div className="stat-number">{countRatings.toLocaleString()}+</div>
            <div className="stat-label">Community Reviews</div>
          </div>
        </div>

        <h2 className="cta-headline">
          Ready to find your next<br />favorite playlist?
        </h2>
        <p className="cta-sub">
          Join thousands of music lovers rating and reviewing Spotify playlists today.
        </p>

        <form className="cta-form" onSubmit={handleSubmit} aria-label="Request early access">
          <input
            type="email"
            className="cta-input"
            placeholder="Enter your Spotify email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`btn btn--primary btn--large ${submitted ? 'btn--success' : ''}`}
          >
            {submitted ? '✓ You\'re on the list!' : 'Get Early Access'}
          </button>
        </form>

        <p className="cta-note">Instant setup · Works with your existing Spotify account</p>
      </div>
    </section>
  );
}
