import { useState } from 'react';
import { featuredPlaylists, topRatedPlaylists, type Playlist } from '../data/playlists';
import { useInView } from '../hooks/useAnimations';
import { ArrowSquareOut, ArrowsClockwise, Star } from '@phosphor-icons/react';
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
    author: 'Elena Rostova',
    role: 'Hall of Fame curator · 9.5 avg score',
    rating: 9.5,
    playlistTitle: 'Indie Discoveries',
    quote: 'I curate on Spotify, but half my audience listens on Apple Music. PlaylistIQ lets them open the tracklist in their native app or recreate it in seconds, and my community rating jumped to 9.5.',
  },
  {
    id: 'rev-2',
    author: 'Marcus Vance',
    role: 'Verified listener · 142 ratings',
    rating: 9.7,
    playlistTitle: 'Classical Masterworks',
    quote: 'Found an incredible classical collection curated on Apple Music and converted it straight into my personal Spotify library with 100% track matches. The community score was completely spot on.',
  },
  {
    id: 'rev-3',
    author: 'David Chen',
    role: 'Producer and DJ · 88 ratings',
    rating: 9.6,
    playlistTitle: 'Coding Flow State',
    quote: 'Having one universal endpoint where anyone can rate track flow on a 1 to 10 scale regardless of what streaming app they pay for is a breath of fresh air for real music curation.',
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

  const scrollToConverter = () => {
    const el = document.getElementById('converter');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

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
                <Star size={14} weight="fill" color="#FF5500" />
                <span>{activePlaylist.rating.toFixed(1)}</span>
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
                Original on {activePlaylist.sourceService} · Top in {activePlaylist.genre.split('/')[0].trim()}
              </div>
            </div>

            <div className="spotlight-content">
              <div className="spotlight-title-row">
                <div>
                  <h3 className="spotlight-title">{activePlaylist.title}</h3>
                  <p className="spotlight-curator">Curated by {activePlaylist.curator}</p>
                </div>
                <span className="spotlight-source-pill">{activePlaylist.sourceService}</span>
              </div>

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

              {/* Multi-app availability chips */}
              <div className="spotlight-available-section">
                <span className="available-label">Available to open on:</span>
                <div className="available-services-chips">
                  {activePlaylist.serviceLinks.map((link) => (
                    <a
                      key={link.service}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="available-service-chip"
                    >
                      <ArrowSquareOut size={13} weight="bold" />
                      <span>{link.service}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="spotlight-actions-row">
                <a
                  href={activePlaylist.sampleUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="spotlight-open-app-btn"
                >
                  <ArrowSquareOut size={16} weight="bold" />
                  <span>Open in {activePlaylist.sourceService}</span>
                </a>
                <button
                  type="button"
                  className="spotlight-convert-btn"
                  onClick={scrollToConverter}
                >
                  <ArrowsClockwise size={16} weight="bold" />
                  <span>Recreate in other apps</span>
                </button>
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
                      <div className="row-title-and-badge">
                        <h4 className="row-playlist-title">{playlist.title}</h4>
                        <span className="row-platform-badge">{playlist.sourceService}</span>
                      </div>
                      <div className="row-playlist-meta">
                        <span>{playlist.curator}</span>
                        <span className="meta-sep" aria-hidden="true">·</span>
                        <span>{playlist.genre}</span>
                        <span className="meta-sep" aria-hidden="true">·</span>
                        <span>{playlist.trackCount} tracks</span>
                      </div>
                    </div>

                    <div className="row-score-badge">
                      <Star size={12} weight="fill" color="#FF5500" />
                      <span>{playlist.rating.toFixed(1)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Evidence Note */}
            <div className="proof-evidence-callout">
              <div className="evidence-icon" aria-hidden="true">✓</div>
              <p className="evidence-text">
                Every score on the leaderboard is derived from community ratings, verified listen history, and transition harmony metrics across all music apps.
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
