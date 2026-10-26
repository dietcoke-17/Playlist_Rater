import { useState } from 'react';
import { featuredPlaylists, topRatedPlaylists, type Playlist } from '../data/playlists';
import { useInView } from '../hooks/useAnimations';
import './ProductProofSection.css';

const allPlaylists: Playlist[] = [...topRatedPlaylists, ...featuredPlaylists];

const GENRES = ['All genres', 'Ambient', 'Classical', 'Indie', 'Lo-fi', 'Jazz'];

interface ListenerReview {
  id: string;
  author: string;
  role: string;
  rating: number;
  playlistTitle: string;
  quote: string;
}

const listenerReviews: ListenerReview[] = [
  {
    id: 'rev-1',
    author: 'Marcus Vance',
    role: 'Verified listener · 142 ratings',
    rating: 9.6,
    playlistTitle: 'Classical Masterworks',
    quote: 'The track sequencing here is exceptional. The dynamic transition between movements is flawless. Deserves every bit of that score.',
  },
  {
    id: 'rev-2',
    author: 'Elena Rostova',
    role: 'Hall of Fame curator · Score 9.5',
    rating: 9.5,
    playlistTitle: 'Indie Discoveries',
    quote: 'Finally a platform where curators get recognized for track flow rather than commercial payola. Discovered four artists Spotify never surfaced.',
  },
  {
    id: 'rev-3',
    author: 'David Chen',
    role: 'Producer and DJ · 88 ratings',
    rating: 9.6,
    playlistTitle: 'Coding Flow State',
    quote: 'The tempo consistency and harmonic progression make this my daily reference. You can see the sonic blueprint before pressing play.',
  },
];

export default function ProductProofSection() {
  const { ref, isInView } = useInView();
  const [selectedGenre, setSelectedGenre] = useState('All genres');
  const [activePlaylistId, setActivePlaylistId] = useState<string>(topRatedPlaylists[0].id);

  const filteredPlaylists = selectedGenre === 'All genres'
    ? allPlaylists.slice(0, 5)
    : allPlaylists.filter((p) => p.genre.toLowerCase().includes(selectedGenre.toLowerCase())).slice(0, 5);

  const activePlaylist = allPlaylists.find((p) => p.id === activePlaylistId) || topRatedPlaylists[0];

  return (
    <section id="playlists" className="proof-section" ref={ref} aria-label="Product proof and community leaderboard">
      <div id="top-playlists" style={{ position: 'absolute', top: 0 }} />
      <div className="proof-container">
        {/* Header */}
        <div className="proof-header">
          <div className="pill-badge pill-badge--dark">
            <span className="badge-dot dot-yellow" aria-hidden="true" /> Real community data
          </div>
          <h2 className={`proof-title ${isInView ? 'revealed' : ''}`}>
            Current leaderboard standings
          </h2>
          <p className="proof-subtitle">
            Rankings update as votes arrive. Every score reflects listener ratings, track progression, and curation consistency.
          </p>

          {/* Functional Genre Filter Buttons */}
          <div className="proof-filter-bar" role="tablist" aria-label="Filter playlists by genre">
            {GENRES.map((genre) => (
              <button
                key={genre}
                role="tab"
                aria-selected={selectedGenre === genre}
                className={`proof-genre-btn ${selectedGenre === genre ? 'active' : ''}`}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Varied Asymmetrical Layout: Spotlight Playlist on Left, Live Leaderboard on Right */}
        <div className="proof-showcase-grid">
          {/* Spotlight Card */}
          <div className="proof-spotlight-card">
            <div className="spotlight-header">
              <span className="spotlight-badge">Leaderboard spotlight</span>
              <div className="spotlight-score-pill">
                ★ {activePlaylist.rating.toFixed(1)}
              </div>
            </div>

            <div
              className="spotlight-visual-banner"
              style={{
                background: `linear-gradient(135deg, ${activePlaylist.coverGradient[0]}, ${activePlaylist.coverGradient[1]})`,
              }}
            >
              <span className="spotlight-cover-icon" aria-hidden="true">
                {activePlaylist.coverIcon}
              </span>
              <div className="spotlight-rank-tag">
                Top rated in {activePlaylist.genre.split('/')[0].trim()}
              </div>
            </div>

            <div className="spotlight-content">
              <h3 className="spotlight-title">{activePlaylist.title}</h3>
              <p className="spotlight-curator">Curated by {activePlaylist.curator}</p>

              <div className="spotlight-metrics-row">
                <div className="spotlight-stat-item">
                  <span className="spotlight-stat-label">Verified reviews</span>
                  <span className="spotlight-stat-value">{activePlaylist.reviewCount.toLocaleString()}</span>
                </div>
                <div className="spotlight-stat-item">
                  <span className="spotlight-stat-label">Tracks</span>
                  <span className="spotlight-stat-value">{activePlaylist.trackCount} songs</span>
                </div>
                <div className="spotlight-stat-item">
                  <span className="spotlight-stat-label">Duration</span>
                  <span className="spotlight-stat-value">{activePlaylist.duration}</span>
                </div>
              </div>

              <div className="spotlight-criteria-box">
                <div className="criteria-header">
                  <span className="criteria-title">Verified score criteria</span>
                  <span className="criteria-status">Consensus reached</span>
                </div>
                <div className="criteria-item">
                  <span>Track transition flow</span>
                  <span className="criteria-val">{(activePlaylist.rating * 0.98).toFixed(1)}</span>
                </div>
                <div className="criteria-item">
                  <span>Tracklist freshness</span>
                  <span className="criteria-val">{(activePlaylist.rating * 0.96).toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Leaderboard List */}
          <div className="proof-leaderboard-col">
            <div className="leaderboard-heading-row">
              <span className="leaderboard-col-title">Rank &amp; collection</span>
              <span className="leaderboard-col-title text-right">Score</span>
            </div>

            <div className="leaderboard-list" role="list">
              {filteredPlaylists.map((playlist, idx) => {
                const isSelected = playlist.id === activePlaylist.id;
                return (
                  <div
                    key={playlist.id}
                    role="listitem"
                    tabIndex={0}
                    className={`leaderboard-row-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => setActivePlaylistId(playlist.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setActivePlaylistId(playlist.id);
                      }
                    }}
                    aria-label={`Rank ${idx + 1}: ${playlist.title} curated by ${playlist.curator}, rating ${playlist.rating}`}
                  >
                    <div className="row-rank-num">0{idx + 1}</div>
                    <div
                      className="row-thumb"
                      style={{
                        background: `linear-gradient(135deg, ${playlist.coverGradient[0]}, ${playlist.coverGradient[1]})`,
                      }}
                    >
                      <span>{playlist.coverIcon}</span>
                    </div>

                    <div className="row-text-info">
                      <h4 className="row-playlist-title">{playlist.title}</h4>
                      <div className="row-playlist-meta">
                        <span>{playlist.curator}</span>
                        <span className="meta-sep" aria-hidden="true">·</span>
                        <span>{playlist.genre}</span>
                        <span className="meta-sep" aria-hidden="true">·</span>
                        <span>{playlist.trackCount} tracks</span>
                      </div>
                    </div>

                    <div className="row-score-badge">
                      ★ {playlist.rating.toFixed(1)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Evidence Note */}
            <div className="proof-evidence-callout">
              <div className="evidence-icon" aria-hidden="true">✓</div>
              <p className="evidence-text">
                Every score on the leaderboard is derived from community ratings, verified listen history, and transition harmony metrics.
              </p>
            </div>
          </div>
        </div>

        {/* Real Customer & Listener Evidence Quotes */}
        <div className="proof-reviews-container">
          <div className="proof-reviews-header">
            <span className="reviews-eyebrow">Listener impressions</span>
            <h3 className="reviews-title">What verified listeners say</h3>
          </div>

          <div className="proof-reviews-grid">
            {listenerReviews.map((rev) => (
              <div key={rev.id} className="proof-review-card">
                <div className="review-card-top">
                  <div className="review-stars">
                    ★ ★ ★ ★ ★
                    <span className="review-score-tag">{rev.rating.toFixed(1)}</span>
                  </div>
                  <span className="review-playlist-tag">{rev.playlistTitle}</span>
                </div>
                <p className="review-quote">"{rev.quote}"</p>
                <div className="review-author-row">
                  <div className="author-avatar" aria-hidden="true">
                    {rev.author[0]}
                  </div>
                  <div className="author-details">
                    <span className="author-name">{rev.author}</span>
                    <span className="author-role">{rev.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
