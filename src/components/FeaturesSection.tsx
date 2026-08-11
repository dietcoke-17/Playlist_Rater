import { features } from '../data/playlists';
import { useInView } from '../hooks/useAnimations';
import './Sections.css';

export default function FeaturesSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="features" className="section section--purple" ref={ref}>
      <div className="section-inner">
        <div className="pill-badge pill-badge--light">
          <span>IMDB for Spotify</span> Built for Music Lovers
        </div>
        <h2 className={`section-headline ${isInView ? 'revealed' : ''}`}>
          Everything you need to<br />rate & discover music
        </h2>
        <p className="section-sub">
          Powerful tools designed for playlist creators, music curators, and casual listeners alike.
        </p>

        <div className={`features-grid ${isInView ? 'revealed' : ''}`}>
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className="feature-card reveal-item"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="feature-card__icon" style={{ background: `${feat.color}15`, color: feat.color }}>
                {feat.icon}
              </div>
              <h3 className="feature-card__title">{feat.title}</h3>
              <p className="feature-card__desc">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
