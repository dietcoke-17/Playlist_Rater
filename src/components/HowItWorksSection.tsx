import { useInView } from '../hooks/useAnimations';
import './Sections.css';

const steps = [
  {
    number: '01',
    icon: '🔍',
    title: 'Discover',
    description: 'Browse thousands of community-rated playlists across every genre, mood, and occasion.',
    color: '#1DB954',
  },
  {
    number: '02',
    icon: '⭐',
    title: 'Rate',
    description: 'Score playlists from 1–10, write reviews, and help the community find the best music.',
    color: '#FFD700',
  },
  {
    number: '03',
    icon: '📊',
    title: 'Analyze',
    description: 'Dive into audio analytics — tempo, energy, danceability, genre breakdowns, and more.',
    color: '#A855F7',
  },
  {
    number: '04',
    icon: '🚀',
    title: 'Share',
    description: 'Share your favourites, follow top curators, and build your reputation as a tastemaker.',
    color: '#FF6B35',
  },
];

export default function HowItWorksSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="how-it-works" className="section section--dark" ref={ref}>
      <div className="section-inner section-inner--text">
        <div className={`hiw-intro ${isInView ? 'revealed' : ''}`}>
          <p className="hiw-lead">
            <span className="highlight-badge-icon">🎧</span>
            <span className="highlight-text">Your playlists</span> are more than background noise.
            They're curated experiences, sonic journeys, and cultural artifacts.
            Yet there's no way to rate, review, and discover them — until now.
          </p>
        </div>

        <div className={`hiw-cta-text ${isInView ? 'revealed' : ''}`}>
          <p>
            It's time for a change.<br />
            With <span className="brand-badge">PlaylistIQ</span> you get the IMDB experience
            for music playlists — discover what's truly worth your ears.
          </p>
        </div>
      </div>

      <div className="section-inner">
        <div className={`hiw-grid ${isInView ? 'revealed' : ''}`}>
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="hiw-card reveal-item"
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div className="hiw-card__number" style={{ color: step.color }}>{step.number}</div>
              <div className="hiw-card__icon">{step.icon}</div>
              <h3 className="hiw-card__title">{step.title}</h3>
              <p className="hiw-card__desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
