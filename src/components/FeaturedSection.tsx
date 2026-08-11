import { featuredPlaylists } from '../data/playlists';
import PlaylistCard from './PlaylistCard';
import { useInView } from '../hooks/useAnimations';
import './Sections.css';

export default function FeaturedSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="featured" className="section section--light" ref={ref}>
      <div className="section-inner">
        <p className="section-eyebrow section-eyebrow--dark">Curated for you</p>
        <h2 className={`section-headline section-headline--dark ${isInView ? 'revealed' : ''}`}>
          Featured <span className="text-spotify">Playlists</span>
        </h2>
        <p className="section-sub section-sub--dark">
          Hand-picked playlists rated by our community of music lovers. Updated weekly.
        </p>

        <div className={`playlist-grid ${isInView ? 'revealed' : ''}`}>
          {featuredPlaylists.map((pl, i) => (
            <div key={pl.id} className="reveal-item" style={{ transitionDelay: `${i * 0.08}s` }}>
              <PlaylistCard playlist={pl} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
