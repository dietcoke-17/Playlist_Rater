import { useState } from 'react';
import { ArrowUpRight, Play, Star } from '@phosphor-icons/react';
import { popularSpotifyPlaylists, type Playlist } from '../data/playlists';
import './SpotifyPlaylistsSection.css';

interface SpotifyPlaylistsSectionProps {
  onSelectPlaylist?: (playlist: Playlist) => void;
  onOpenPopularPage?: () => void;
}

const CATEGORIES = ['All Playlists', 'Chill & Lo Fi', 'Electronic & Dance', 'Classical & Acoustic', 'City Pop & Funk'];

export default function SpotifyPlaylistsSection({ onSelectPlaylist, onOpenPopularPage }: SpotifyPlaylistsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('All Playlists');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredPlaylists = popularSpotifyPlaylists.filter((item) => {
    if (selectedCategory === 'All Playlists') return true;
    if (selectedCategory === 'Chill & Lo Fi') return item.genre.toLowerCase().includes('chill') || item.genre.toLowerCase().includes('lo fi');
    if (selectedCategory === 'Electronic & Dance') return item.genre.toLowerCase().includes('house') || item.genre.toLowerCase().includes('electronic');
    if (selectedCategory === 'Classical & Acoustic') return item.genre.toLowerCase().includes('classical') || item.genre.toLowerCase().includes('acoustic');
    if (selectedCategory === 'City Pop & Funk') return item.genre.toLowerCase().includes('city') || item.genre.toLowerCase().includes('funk');
    return true;
  });

  const handleCardClick = (playlist: Playlist) => {
    if (onSelectPlaylist) {
      onSelectPlaylist(playlist);
    } else {
      window.open(playlist.sampleUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="popular-playlists" className="spotify-section" aria-label="Popular and top community playlists">
      <div className="spotify-container">
        {/* Section Header (Spotify Style) */}
        <div className="spotify-header-row">
          <div className="spotify-title-group">
            <h2 className="spotify-main-heading">Popular & Top Playlists</h2>
            <p className="spotify-sub-heading">
              Browse top community rated playlists across Spotify, Apple Music, and YouTube Music.
            </p>
          </div>
          <div className="spotify-header-right">
            {onOpenPopularPage && (
              <button
                type="button"
                className="spotify-show-all-btn"
                onClick={onOpenPopularPage}
              >
                <span>View All Popular Playlists</span>
                <ArrowUpRight size={14} weight="bold" />
              </button>
            )}
            <div className="spotify-stats-pill">
              <span className="stats-dot" />
              <span>Updated live by curators</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="spotify-filter-bar" role="tablist" aria-label="Playlist genre filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={selectedCategory === cat}
              className={`spotify-filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Spotify Card Grid */}
        <div className="spotify-card-grid">
          {filteredPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="spotify-card"
              onMouseEnter={() => setHoveredId(playlist.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleCardClick(playlist)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(playlist);
                }
              }}
              aria-label={`${playlist.title} by ${playlist.curator}, rated ${playlist.rating} out of 10`}
            >
              {/* Artwork wrapper with floating Spotify Play Button */}
              <div className="spotify-card-artwork">
                <img
                  src={playlist.coverImage}
                  alt={playlist.title}
                  className="spotify-artwork-img"
                  loading="lazy"
                />

                {/* Platform Tag */}
                <span className={`spotify-platform-tag ${playlist.sourceService.toLowerCase().replace(/\s+/g, '')}`}>
                  {playlist.sourceService}
                </span>

                {/* Authentic Floating Spotify Play Button */}
                <button
                  type="button"
                  className={`spotify-floating-play-btn ${hoveredId === playlist.id ? 'visible' : ''}`}
                  aria-label={`Play ${playlist.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(playlist.sampleUrl, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <Play size={22} weight="fill" color="#000000" />
                </button>
              </div>

              {/* Card Meta */}
              <div className="spotify-card-content">
                <h3 className="spotify-card-title">{playlist.title}</h3>
                <p className="spotify-card-desc">{playlist.description}</p>

                <div className="spotify-card-footer">
                  <div className="spotify-rating-badge">
                    <Star size={13} weight="fill" color="#1DB954" />
                    <span className="rating-num">{playlist.rating}</span>
                    <span className="rating-scale">/ 10</span>
                  </div>

                  <span className="spotify-track-count">{playlist.trackCount} tracks</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
