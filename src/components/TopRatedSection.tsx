import { topRatedPlaylists } from '../data/playlists';
import PlaylistCard from './PlaylistCard';
import { useInView } from '../hooks/useAnimations';
import './Sections.css';

export default function TopRatedSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="top-playlists" className="section section--green" ref={ref}>
      <div className="section-inner">
        <div className="pill-badge pill-badge--dark">
          <span>🏆 Hall of Fame</span> 9.0+ Highest Rated
        </div>
        <h2 className={`section-headline section-headline--dark ${isInView ? 'revealed' : ''}`}>
          Top Playlists & <br />Curator Leaderboard
        </h2>
        <p className="section-sub section-sub--dark">
          Featuring the most acclaimed playlists across the spatial web voted by community acceptors.
        </p>

        <div className={`top-rated-list ${isInView ? 'revealed' : ''}`}>
          {topRatedPlaylists.map((pl, i) => (
            <div key={pl.id} className="reveal-item" style={{ transitionDelay: `${i * 0.1}s` }}>
              <PlaylistCard playlist={pl} rank={i + 1} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
