import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  MagnifyingGlass,
  Play,
  ArrowUpRight,
  ArrowsClockwise,
  Star,
  CheckCircle,
  X,
  MusicNotes,
  User,
} from '@phosphor-icons/react';
import {
  popularSpotifyPlaylists,
  curatorsList,
  type Playlist,
  type StreamingService,
} from '../data/playlists';
import './PopularPage.css';

interface PopularPageProps {
  onBack: () => void;
  onSelectPlaylist?: (playlist: Playlist) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Curations', count: 12 },
  { id: 'lofi', label: 'Lo Fi Chill', count: 3 },
  { id: 'citypop', label: 'City Pop and Funk', count: 2 },
  { id: 'classical', label: 'Neo Classical', count: 2 },
  { id: 'electronic', label: 'Deep House and Club', count: 3 },
  { id: 'hiphop', label: 'Hip Hop and Soul', count: 2 },
  { id: 'pop', label: 'Alt Pop and Acoustic', count: 2 },
];

export default function PopularPage({ onBack, onSelectPlaylist }: PopularPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCurator, setSelectedCurator] = useState<string | null>(null);
  const [inspectingPlaylist, setInspectingPlaylist] = useState<Playlist | null>(null);
  const [activeTab, setActiveTab] = useState<'playlists' | 'curators'>('playlists');
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [targetConvertService, setTargetConvertService] = useState<StreamingService>('Apple Music');
  const [convertSuccess, setConvertSuccess] = useState<string | null>(null);

  // Filtered playlists
  const filteredPlaylists = useMemo(() => {
    return popularSpotifyPlaylists.filter((p) => {
      const matchesSearch =
        searchQuery === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.curator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tracks && p.tracks.some((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.artist.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCurator = !selectedCurator || p.curatorHandle === selectedCurator;

      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'lofi' && p.genre.toLowerCase().includes('lo fi')) ||
        (selectedCategory === 'citypop' && p.genre.toLowerCase().includes('city pop')) ||
        (selectedCategory === 'classical' && p.genre.toLowerCase().includes('classical')) ||
        (selectedCategory === 'electronic' && (p.genre.toLowerCase().includes('house') || p.genre.toLowerCase().includes('electronic') || p.genre.toLowerCase().includes('techno'))) ||
        (selectedCategory === 'hiphop' && p.genre.toLowerCase().includes('hip hop')) ||
        (selectedCategory === 'pop' && (p.genre.toLowerCase().includes('pop') || p.genre.toLowerCase().includes('acoustic')));

      return matchesSearch && matchesCurator && matchesCategory;
    });
  }, [searchQuery, selectedCurator, selectedCategory]);

  const handleOpenInside = (playlist: Playlist) => {
    setInspectingPlaylist(playlist);
    setConvertSuccess(null);
  };

  const handleCloseInside = () => {
    setInspectingPlaylist(null);
    setPlayingTrackId(null);
    setConvertSuccess(null);
  };

  const handleTogglePlay = (trackId: string) => {
    setPlayingTrackId((prev) => (prev === trackId ? null : trackId));
  };

  const handleConvertAction = (playlist: Playlist) => {
    setConvertSuccess(`Successfully recreated ${playlist.trackCount} tracks in ${targetConvertService}! Ready to open in native player.`);
    setTimeout(() => {
      setConvertSuccess(null);
    }, 4500);
  };

  return (
    <div className="popular-page-root">
      {/* Subtle Graphic Grid Lines overlay */}
      <div className="popular-grid-lines" aria-hidden="true" />
      <div className="popular-spotlight" aria-hidden="true" />

      {/* Top Navigation Bar */}
      <header className="popular-top-bar">
        <div className="popular-top-container">
          <div className="popular-top-left">
            <button
              type="button"
              className="popular-back-btn"
              onClick={onBack}
              id="popular-back-btn"
              aria-label="Back to Hub"
            >
              <ArrowLeft size={16} weight="bold" />
              <span>Back to Hub</span>
            </button>

            {/* View Switcher: Playlists vs Curators (inspired by Image 2 Artists / Playlists toggle) */}
            <div className="popular-view-toggle" role="tablist" aria-label="View mode">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'playlists'}
                className={`popular-toggle-item ${activeTab === 'playlists' ? 'active' : ''}`}
                onClick={() => setActiveTab('playlists')}
              >
                <MusicNotes size={14} weight="bold" />
                <span>Playlists</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'curators'}
                className={`popular-toggle-item ${activeTab === 'curators' ? 'active' : ''}`}
                onClick={() => setActiveTab('curators')}
              >
                <User size={14} weight="bold" />
                <span>Curators and Artists</span>
              </button>
            </div>
          </div>

          <div className="popular-top-brand">
            <div className="popular-brand-mark">
              <svg width="22" height="22" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                <rect width="36" height="36" rx="8" fill="#FFFFFF" />
                <path fillRule="evenodd" clipRule="evenodd" d="M11 8H20.5C24.5 8 27.5 11 27.5 15C27.5 19 24.5 22 20.5 22H15.5V28H11V8ZM15.5 12V18H20C21.6 18 23 16.7 23 15C23 13.3 21.6 12 20 12H15.5Z" fill="#000000" />
              </svg>
              <span className="popular-brand-title">PLAYLITFY POPULAR</span>
            </div>
            <span className="popular-live-badge">
              <span className="live-dot" />
              ALL PLATFORMS CONNECTED
            </span>
          </div>
        </div>
      </header>

      {/* Hero Header Area */}
      <section className="popular-hero-area">
        <div className="popular-hero-container">
          <span className="popular-eyebrow-pill">CURATION DIRECTORY</span>
          <h1 className="popular-page-title">
            All Popular Playlists
          </h1>
          <p className="popular-page-subtitle">
            Explore community rated curations across Spotify, Apple Music, and YouTube Music.
            Inspect full tracklists, discover top curators, and transfer to any native music app in seconds.
          </p>

          {/* Spotify Style Search Bar (matching Image 3 top search bar) */}
          <div className="popular-search-wrapper">
            <div className="popular-search-box">
              <MagnifyingGlass size={18} weight="bold" className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search playlists, artists, tracks, or curators..."
                className="popular-search-input"
                aria-label="Search playlists"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={14} weight="bold" />
                </button>
              )}
            </div>
          </div>

          {/* Category Count Filter Pills (matching Image 2 categories with count badges) */}
          <div className="popular-filter-pills-bar" role="tablist" aria-label="Genre filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat.id}
                className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedCurator(null);
                }}
              >
                <span>{cat.label}</span>
                <span className="pill-count">{cat.count}</span>
              </button>
            ))}
            {selectedCurator && (
              <button
                type="button"
                className="filter-pill curator-active"
                onClick={() => setSelectedCurator(null)}
              >
                <span>Filter: {selectedCurator}</span>
                <X size={12} weight="bold" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Section A: Featured Curators and Artists (inspired by Image 3 and Image 2 top circles) */}
      <section className="popular-curators-section" aria-label="Top Curators and Artists">
        <div className="popular-main-container">
          <div className="section-header-row">
            <div>
              <h2 className="section-heading">Featured Curators and Artists</h2>
              <p className="section-subheading">Verified music lovers and creators with transparent scoring</p>
            </div>
            {selectedCurator && (
              <button
                type="button"
                className="reset-filter-btn"
                onClick={() => setSelectedCurator(null)}
              >
                View all curators
              </button>
            )}
          </div>

          <div className="curators-carousel">
            {curatorsList.map((curator) => {
              const isSelected = selectedCurator === curator.handle;
              return (
                <button
                  key={curator.id}
                  type="button"
                  className={`curator-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedCurator(isSelected ? null : curator.handle)}
                  aria-label={`Filter by curator ${curator.name}`}
                >
                  <div className="curator-avatar-frame">
                    <img
                      src={curator.avatar}
                      alt={curator.name}
                      className="curator-avatar-img"
                      loading="lazy"
                    />
                    {curator.verified && (
                      <span className="curator-verified-dot" title="Verified Curator">
                        <CheckCircle size={14} weight="fill" />
                      </span>
                    )}
                  </div>
                  <span className="curator-card-name">{curator.name}</span>
                  <span className="curator-card-handle">{curator.handle}</span>
                  <div className="curator-card-meta">
                    <span className="curator-rating">
                      <Star size={11} weight="fill" /> {curator.rating}
                    </span>
                    <span className="curator-listeners">{curator.listenersCount} listeners</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section B: All Popular Playlists (Spotify Style Grid) */}
      <section className="popular-grid-section" aria-label="Popular playlists collection">
        <div className="popular-main-container">
          <div className="section-header-row">
            <div>
              <h2 className="section-heading">
                {selectedCurator
                  ? `Playlists by ${selectedCurator}`
                  : selectedCategory !== 'all'
                  ? `${CATEGORIES.find((c) => c.id === selectedCategory)?.label} Playlists`
                  : 'Popular Playlists in System'}
              </h2>
              <p className="section-subheading">
                Showing {filteredPlaylists.length} hand picked curations with direct app launchers
              </p>
            </div>
          </div>

          {filteredPlaylists.length === 0 ? (
            <div className="empty-results-box">
              <MusicNotes size={36} weight="duotone" />
              <h3>No matching playlists found</h3>
              <p>Try searching for a different keyword or reset the category filter.</p>
              <button
                type="button"
                className="reset-filters-cta"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedCurator(null);
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="spotify-cards-grid">
              {filteredPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="spotify-playlist-card"
                  onClick={() => handleOpenInside(playlist)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenInside(playlist);
                    }
                  }}
                  aria-label={`Inspect ${playlist.title} playlist`}
                >
                  {/* Square Artwork with floating hover play button */}
                  <div className="card-artwork-wrapper">
                    <img
                      src={playlist.coverImage}
                      alt={playlist.title}
                      className="card-artwork-img"
                      loading="lazy"
                    />
                    <div className="card-floating-play" title="Inspect playlist tracks">
                      <Play size={20} weight="fill" />
                    </div>
                    <div className="card-rating-badge">
                      <Star size={11} weight="fill" />
                      <span>{playlist.rating}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="card-details">
                    <h3 className="card-title" title={playlist.title}>
                      {playlist.title}
                    </h3>
                    <p className="card-curator">
                      by <span>{playlist.curator}</span>
                    </p>
                    <p className="card-desc">
                      {playlist.description}
                    </p>

                    <div className="card-footer-meta">
                      <span className="card-genre-pill">{playlist.genre}</span>
                      <span className="card-track-count">{playlist.trackCount} tracks</span>
                    </div>

                    {/* Card Actions Row */}
                    <div className="card-action-bar">
                      <button
                        type="button"
                        className="card-inspect-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenInside(playlist);
                        }}
                      >
                        <span>Inspect Tracks</span>
                      </button>
                      <button
                        type="button"
                        className="card-open-native-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectPlaylist) {
                            onSelectPlaylist(playlist);
                          } else {
                            window.open(playlist.sampleUrl, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        aria-label={`Open ${playlist.title} in native app`}
                      >
                        <span>Open</span>
                        <ArrowUpRight size={13} weight="bold" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section C: Inside Playlist Modal / Drawer (Inspired by Image 2 and Image 3!) */}
      {inspectingPlaylist && (
        <div
          className="inside-playlist-backdrop"
          onClick={handleCloseInside}
          role="dialog"
          aria-modal="true"
          aria-labelledby="inside-playlist-title"
        >
          <div
            className="inside-playlist-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="inside-modal-header">
              <div className="inside-hero-split">
                {/* Big Square Artwork */}
                <div className="inside-cover-box">
                  <img
                    src={inspectingPlaylist.coverImage}
                    alt={inspectingPlaylist.title}
                    className="inside-cover-img"
                  />
                  <div className="inside-score-pill">
                    <Star size={13} weight="fill" />
                    <span>{inspectingPlaylist.rating} / 10</span>
                  </div>
                </div>

                {/* Hero Metadata */}
                <div className="inside-info-box">
                  <div className="inside-eyebrow-row">
                    <span className="inside-type-tag">PLAYLIST</span>
                    <span className="inside-platform-badge">{inspectingPlaylist.sourceService}</span>
                  </div>

                  <h2 id="inside-playlist-title" className="inside-playlist-title">
                    {inspectingPlaylist.title}
                  </h2>

                  <p className="inside-playlist-desc">
                    {inspectingPlaylist.description}
                  </p>

                  <div className="inside-curator-row">
                    <span className="inside-curator-name">
                      Curated by <strong>{inspectingPlaylist.curator}</strong>
                    </span>
                    <span className="dot-sep">•</span>
                    <span>{inspectingPlaylist.trackCount} tracks</span>
                    <span className="dot-sep">•</span>
                    <span>{inspectingPlaylist.duration}</span>
                    <span className="dot-sep">•</span>
                    <span className="match-tag">100% matched across catalogues</span>
                  </div>

                  {/* Actions Row (Open & Convert) */}
                  <div className="inside-actions-row">
                    <a
                      href={inspectingPlaylist.sampleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inside-primary-open-btn"
                    >
                      <Play size={16} weight="fill" />
                      <span>Play on {inspectingPlaylist.sourceService}</span>
                      <ArrowUpRight size={14} weight="bold" />
                    </a>

                    <div className="inside-convert-cluster">
                      <select
                        value={targetConvertService}
                        onChange={(e) => setTargetConvertService(e.target.value as StreamingService)}
                        className="inside-service-select"
                        aria-label="Target music service for conversion"
                      >
                        <option value="Apple Music">Convert to Apple Music</option>
                        <option value="Spotify">Convert to Spotify</option>
                        <option value="YouTube Music">Convert to YouTube Music</option>
                        <option value="Amazon Music">Convert to Amazon Music</option>
                        <option value="TIDAL">Convert to TIDAL</option>
                      </select>

                      <button
                        type="button"
                        className="inside-convert-btn"
                        onClick={() => handleConvertAction(inspectingPlaylist)}
                      >
                        <ArrowsClockwise size={14} weight="bold" />
                        <span>Recreate Now</span>
                      </button>
                    </div>
                  </div>

                  {convertSuccess && (
                    <div className="convert-success-alert" role="status">
                      <CheckCircle size={16} weight="fill" />
                      <span>{convertSuccess}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                className="inside-modal-close-btn"
                onClick={handleCloseInside}
                aria-label="Close playlist view"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {/* In-Playlist Tracklist Table (Inspired by Image 2 and Image 3) */}
            <div className="inside-tracklist-section">
              <div className="inside-tracklist-heading-row">
                <span className="col-num">#</span>
                <span className="col-title">TITLE</span>
                <span className="col-album">ALBUM</span>
                <span className="col-match">STATUS</span>
                <span className="col-duration">DURATION</span>
              </div>

              <div className="inside-tracks-list" role="list">
                {inspectingPlaylist.tracks && inspectingPlaylist.tracks.length > 0 ? (
                  inspectingPlaylist.tracks.map((track, index) => {
                    const isPlaying = playingTrackId === track.id;
                    return (
                      <div
                        key={track.id}
                        role="listitem"
                        className={`inside-track-row ${isPlaying ? 'playing' : ''}`}
                        onClick={() => handleTogglePlay(track.id)}
                      >
                        <div className="col-num">
                          <button
                            type="button"
                            className="track-play-toggle-btn"
                            aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                          >
                            {isPlaying ? (
                              <span className="equalizer-bars" aria-hidden="true">
                                <span className="eq-bar" />
                                <span className="eq-bar" />
                                <span className="eq-bar" />
                              </span>
                            ) : (
                              <span className="track-index">{index + 1}</span>
                            )}
                            <Play size={12} weight="fill" className="track-hover-play-icon" />
                          </button>
                        </div>

                        <div className="col-title track-info-cell">
                          <img
                            src={track.coverImage}
                            alt={track.title}
                            className="track-thumbnail-img"
                            loading="lazy"
                          />
                          <div className="track-meta">
                            <span className="track-title-text">{track.title}</span>
                            <span className="track-artist-text">{track.artist}</span>
                          </div>
                        </div>

                        <div className="col-album track-album-cell">
                          <span>{track.album || 'Single Release'}</span>
                        </div>

                        <div className="col-match track-match-cell">
                          <span className="track-match-badge">
                            <CheckCircle size={12} weight="fill" />
                            <span>{track.matchRate}</span>
                          </span>
                        </div>

                        <div className="col-duration track-dur-cell">
                          <span>{track.duration}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-tracks-note">
                    <p>Track catalog synchronizing with source streaming API.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Sticky Bar */}
            <div className="inside-modal-footer">
              <div className="footer-playback-note">
                <span className="playback-pulse" />
                <span>Audio previews streamed directly from source catalog</span>
              </div>
              <button
                type="button"
                className="inside-done-btn"
                onClick={handleCloseInside}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
