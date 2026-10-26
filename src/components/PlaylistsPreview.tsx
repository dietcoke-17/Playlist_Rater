import { featuredPlaylists } from '../data/playlists';
import PlaylistCard from './PlaylistCard';
import { useInView } from '../hooks/useAnimations';
import './PlaylistsPreview.css';
import './Sections.css';

export default function PlaylistsPreview() {
  const { ref, isInView } = useInView();
  const previewPlaylists = featuredPlaylists.slice(0, 4);

  const scrollToMore = () => {
    const el = document.getElementById('top-playlists');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="playlists" className="section section--light" ref={ref}>
      <div className="section-inner">
        <div className="pill-badge pill-badge--dark">
          <span className="badge-dot dot-green" /> 10,000+ curated collections
        </div>

        <h2 className={`section-headline section-headline--dark ${isInView ? 'revealed' : ''}`}>
          Browse top playlists
        </h2>
        <p className="section-sub section-sub--dark">
          Rated by thousands of music lovers. Updated as the community votes.
        </p>

        <div className={`playlist-grid ${isInView ? 'revealed' : ''}`}>
          {previewPlaylists.map((pl, i) => (
            <div key={pl.id} className="reveal-item" style={{ transitionDelay: `${i * 0.08}s` }}>
              <PlaylistCard playlist={pl} />
            </div>
          ))}
        </div>

        <div className="preview-footer">
          <button className="browse-all-btn" onClick={scrollToMore}>
            See the leaderboard
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
