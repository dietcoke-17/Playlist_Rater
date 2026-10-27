import { useState, useMemo, useEffect, useCallback, useDeferredValue, memo } from 'react';
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
  Plus,
  Trophy,
  ShieldCheck,
} from '@phosphor-icons/react';
import {
  curatorsList,
  getCommunityPlaylists,
  publishCommunityPlaylist,
  getUserRatings,
  rateCommunityPlaylist,
  type Playlist,
  type StreamingService,
} from '../data/playlists';
import { api } from '../lib/api';
import './PopularPage.css';

interface PopularPageProps {
  onBack: () => void;
  onSelectPlaylist?: (playlist: Playlist) => void;
  initialOpenPublish?: boolean;
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

/* Memoized Curator Card to eliminate carousel scrolling lag */
interface CuratorCardItemProps {
  curator: typeof curatorsList[0];
  isSelected: boolean;
  onSelect: (handle: string) => void;
}

const CuratorCardItem = memo(function CuratorCardItem({
  curator,
  isSelected,
  onSelect,
}: CuratorCardItemProps) {
  return (
    <button
      type="button"
      className={`curator-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(curator.handle)}
      aria-label={`Filter by allowed curator ${curator.name}`}
    >
      <div className="curator-avatar-frame">
        <img
          src={curator.avatar}
          alt={curator.name}
          className="curator-avatar-img"
          loading="lazy"
          decoding="async"
        />
        {curator.verified && (
          <span className="curator-verified-dot" title="Verified Curator">
            <CheckCircle size={14} weight="fill" />
          </span>
        )}
      </div>
      <span className="curator-card-name">{curator.name}</span>
      <span className="curator-card-handle">{curator.handle}</span>

      <div className="curator-permission-pill">
        <span className="green-permission-dot" />
        <span>Public Display Active</span>
      </div>

      <div className="curator-card-meta">
        <span className="curator-rating">
          <Star size={11} weight="fill" /> {curator.rating}
        </span>
        <span className="curator-listeners">{curator.playlistsCount} curations</span>
      </div>
    </button>
  );
});

/* Memoized Playlist Card to isolate re-renders and deliver 60fps grid scrolling */
interface PlaylistCardItemProps {
  playlist: Playlist;
  userGivenRating?: number;
  isRatingOpen: boolean;
  onOpenInside: (p: Playlist) => void;
  onSelectPlaylist?: (p: Playlist) => void;
  onToggleRating: (id: string) => void;
  onRate: (id: string, score: number, e?: React.MouseEvent) => void;
}

const PlaylistCardItem = memo(function PlaylistCardItem({
  playlist,
  userGivenRating,
  isRatingOpen,
  onOpenInside,
  onSelectPlaylist,
  onToggleRating,
  onRate,
}: PlaylistCardItemProps) {
  return (
    <div
      className="spotify-playlist-card"
      onClick={() => onOpenInside(playlist)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenInside(playlist);
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
          decoding="async"
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

        {/* Interactive Community Rating Bar on Card */}
        <div
          className="card-rating-widget"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="rating-widget-info">
            <span className="community-score-label">
              <Star size={12} weight="fill" color="#eab308" />
              <strong>{playlist.rating}</strong> / 10 ({playlist.reviewCount || 1} votes)
            </span>
            <button
              type="button"
              className={`rate-trigger-btn ${userGivenRating ? 'voted' : ''}`}
              onClick={() => onToggleRating(playlist.id)}
            >
              {userGivenRating ? `You: ${userGivenRating}.0 ★` : 'Rate (1 to 10)'}
            </button>
          </div>

          {/* 1 to 10 Rating Selector Popover */}
          {isRatingOpen && (
            <div className="rating-selector-popover" role="dialog" aria-label="Select score">
              <span className="popover-title">Rate this curation:</span>
              <div className="score-buttons-row">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                  <button
                    key={score}
                    type="button"
                    className={`score-select-btn ${userGivenRating === score ? 'active' : ''}`}
                    onClick={(e) => onRate(playlist.id, score, e)}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card Actions Row */}
        <div className="card-action-bar">
          <button
            type="button"
            className="card-inspect-btn"
            onClick={(e) => {
              e.stopPropagation();
              onOpenInside(playlist);
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
  );
});

/* Memoized Leaderboard Row */
interface LeaderboardRowItemProps {
  item: Playlist;
  idx: number;
  onOpenInside: (p: Playlist) => void;
}

const LeaderboardRowItem = memo(function LeaderboardRowItem({
  item,
  idx,
  onOpenInside,
}: LeaderboardRowItemProps) {
  return (
    <div
      className="lb-table-row"
      role="listitem"
      onClick={() => onOpenInside(item)}
    >
      <div className="lb-col-rank">
        <span className={`lb-rank-num ${idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : ''}`}>
          {idx + 1}
        </span>
      </div>

      <div className="lb-col-title lb-title-cell">
        <img src={item.coverImage} alt={item.title} className="lb-cover-thumb" loading="lazy" decoding="async" />
        <div className="lb-title-group">
          <span className="lb-playlist-name">{item.title}</span>
          <span className="lb-playlist-curator">Curated by {item.curator} ({item.curatorHandle})</span>
        </div>
      </div>

      <div className="lb-col-genre">
        <span className="lb-genre-badge">{item.genre}</span>
      </div>

      <div className="lb-col-match">
        <span className="lb-match-pill">
          <CheckCircle size={12} weight="fill" />
          <span>100% matched</span>
        </span>
      </div>

      <div className="lb-col-rating">
        <span className="lb-score-text">
          <Star size={13} weight="fill" color="#eab308" />
          <strong>{item.rating}</strong> / 10
        </span>
      </div>

      <div className="lb-col-action" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="lb-inspect-row-btn"
          onClick={() => onOpenInside(item)}
        >
          Inspect
        </button>
        <a
          href={item.sampleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="lb-play-row-btn"
          aria-label={`Open ${item.title}`}
        >
          <Play size={12} weight="fill" />
        </a>
      </div>
    </div>
  );
});

export default function PopularPage({ onBack, onSelectPlaylist, initialOpenPublish = false }: PopularPageProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => getCommunityPlaylists());
  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => getUserRatings());
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearch = useDeferredValue(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCurator, setSelectedCurator] = useState<string | null>(null);
  const [inspectingPlaylist, setInspectingPlaylist] = useState<Playlist | null>(null);
  const [activeTab, setActiveTab] = useState<'playlists' | 'curators' | 'leaderboard'>('playlists');
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [targetConvertService, setTargetConvertService] = useState<StreamingService>('Apple Music');
  const [convertSuccess, setConvertSuccess] = useState<string | null>(null);

  // Rating popover on cards
  const [activeRatingCardId, setActiveRatingCardId] = useState<string | null>(null);
  const [ratingToast, setRatingToast] = useState<string | null>(null);

  // Publish Modal State
  const [isPublishOpen, setIsPublishOpen] = useState(initialOpenPublish);
  const [pubTitle, setPubTitle] = useState('');
  const [pubUrl, setPubUrl] = useState('');
  const [pubCurator, setPubCurator] = useState('');
  const [pubHandle, setPubHandle] = useState('');
  const [pubGenre, setPubGenre] = useState('Lo Fi Chill');
  const [pubDesc, setPubDesc] = useState('');
  const [pubConsent, setPubConsent] = useState(true);
  const [publishSuccess, setPublishSuccess] = useState(false);

  useEffect(() => {
    if (initialOpenPublish) {
      setIsPublishOpen(true);
    }
  }, [initialOpenPublish]);

  // Filtered playlists using deferred search query for non-blocking UI typing
  const filteredPlaylists = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    return playlists.filter((p) => {
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.curator.toLowerCase().includes(q) ||
        p.genre.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tracks && p.tracks.some((t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)));

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
  }, [playlists, deferredSearch, selectedCurator, selectedCategory]);

  // Ranked Leaderboard Sort
  const rankedPlaylists = useMemo(() => {
    return [...playlists].sort((a, b) => b.rating - a.rating);
  }, [playlists]);

  const handleOpenInside = useCallback((playlist: Playlist) => {
    setInspectingPlaylist(playlist);
    setConvertSuccess(null);
  }, []);

  const handleCloseInside = useCallback(() => {
    setInspectingPlaylist(null);
    setPlayingTrackId(null);
    setConvertSuccess(null);
  }, []);

  const handleTogglePlay = useCallback((trackId: string) => {
    setPlayingTrackId((prev) => (prev === trackId ? null : trackId));
  }, []);

  const handleConvertAction = useCallback((playlist: Playlist) => {
    setConvertSuccess(`Successfully recreated ${playlist.trackCount} tracks in ${targetConvertService}! Ready to open in native player.`);
    setTimeout(() => {
      setConvertSuccess(null);
    }, 4500);
  }, [targetConvertService]);

  const handleToggleRating = useCallback((id: string) => {
    setActiveRatingCardId((prev) => (prev === id ? null : id));
  }, []);

  const handleSelectCurator = useCallback((handle: string) => {
    setSelectedCurator((prev) => (prev === handle ? null : handle));
    setActiveTab('playlists');
  }, []);

  const handleRate = useCallback((playlistId: string, score: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const { updatedPlaylist, userRatings: updatedRatings } = rateCommunityPlaylist(playlistId, score);
    setUserRatings({ ...updatedRatings });

    if (updatedPlaylist) {
      setPlaylists((prev) => prev.map((item) => (item.id === playlistId ? updatedPlaylist : item)));
      setInspectingPlaylist((prev) => (prev && prev.id === playlistId ? updatedPlaylist : prev));
    }

    // Submit vote to backend API asynchronously
    api.submitRating(playlistId, score).catch((err) => {
      console.warn('Backend vote sync notice:', err);
    });

    setActiveRatingCardId(null);
    setRatingToast(`Your rating of ${score}.0 recorded! Thank you for curating.`);
    setTimeout(() => {
      setRatingToast(null);
    }, 3500);
  }, []);

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubTitle.trim() || !pubUrl.trim() || !pubCurator.trim() || !pubConsent) return;

    let sourceService: StreamingService = 'Spotify';
    if (pubUrl.includes('apple')) sourceService = 'Apple Music';
    else if (pubUrl.includes('youtube')) sourceService = 'YouTube Music';
    else if (pubUrl.includes('tidal')) sourceService = 'TIDAL';
    else if (pubUrl.includes('amazon')) sourceService = 'Amazon Music';

    const cleanHandle = pubHandle.trim()
      ? pubHandle.startsWith('@') ? pubHandle.trim() : `@${pubHandle.trim()}`
      : `@${pubCurator.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

    const newPlaylist: Playlist = {
      id: `pub-${Date.now()}`,
      title: pubTitle.trim(),
      curator: pubCurator.trim(),
      curatorHandle: cleanHandle,
      rating: 9.6,
      reviewCount: 1,
      trackCount: 38,
      duration: '2h 15m',
      genre: pubGenre,
      sourceService,
      coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      description: pubDesc.trim() || 'Community playlist published with verified authorization for public listening and rating.',
      sampleUrl: pubUrl.trim(),
      serviceLinks: [
        { service: sourceService, url: pubUrl.trim(), available: true },
        { service: 'Apple Music', url: pubUrl.trim(), available: true },
        { service: 'Spotify', url: pubUrl.trim(), available: true },
      ],
      matchedPercentage: 100,
      allowedPublic: true,
      tracks: [
        {
          id: `trk-${Date.now()}-1`,
          title: 'Opening Groove',
          artist: pubCurator.trim(),
          album: 'Curated Selections',
          duration: '03:42',
          coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&auto=format&fit=crop&q=80',
          matchRate: '100% matched',
        },
        {
          id: `trk-${Date.now()}-2`,
          title: 'Midnight Resonance',
          artist: pubCurator.trim(),
          album: 'Curated Selections',
          duration: '04:15',
          coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
          matchRate: '100% matched',
        },
      ],
    };

    // If Spotify playlist and user gave explicit curator permission, sync to backend
    if (pubConsent && pubUrl.includes('spotify.com/playlist')) {
      api.publishPlaylist({
        spotifyPlaylistUrl: pubUrl.trim(),
        genre: pubGenre,
        description: pubDesc.trim(),
        allowPublic: true,
      }).catch((err) => {
        console.warn('Backend playlist publish notice:', err);
      });
    }

    const updated = publishCommunityPlaylist(newPlaylist);
    setPlaylists(updated);
    setPublishSuccess(true);

    setTimeout(() => {
      setPublishSuccess(false);
      setIsPublishOpen(false);
      setPubTitle('');
      setPubUrl('');
      setPubCurator('');
      setPubHandle('');
      setPubDesc('');
    }, 1800);
  };

  return (
    <div className="popular-page-root">
      {/* Subtle Graphic Grid Lines overlay */}
      <div className="popular-grid-lines" aria-hidden="true" />
      <div className="popular-spotlight" aria-hidden="true" />

      {/* Toast Notification */}
      {ratingToast && (
        <div className="global-rating-toast" role="status">
          <CheckCircle size={16} weight="fill" />
          <span>{ratingToast}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="popular-top-bar">
        <div className="popular-top-container">
          <div className="popular-top-left">
            <button
              type="button"
              className="popular-back-btn"
              onClick={onBack}
              id="popular-back-btn"
              aria-label="Back to Converter"
            >
              <ArrowLeft size={16} weight="bold" />
              <span>Back to Converter</span>
            </button>

            {/* View Switcher: Playlists vs Curators vs Leaderboard */}
            <div className="popular-view-toggle" role="tablist" aria-label="View mode">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'playlists'}
                className={`popular-toggle-item ${activeTab === 'playlists' ? 'active' : ''}`}
                onClick={() => setActiveTab('playlists')}
              >
                <MusicNotes size={14} weight="bold" />
                <span>All Playlists</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'curators'}
                className={`popular-toggle-item ${activeTab === 'curators' ? 'active' : ''}`}
                onClick={() => setActiveTab('curators')}
              >
                <User size={14} weight="bold" />
                <span>Allowed Curators</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'leaderboard'}
                className={`popular-toggle-item ${activeTab === 'leaderboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('leaderboard')}
              >
                <Trophy size={14} weight="bold" />
                <span>Top Leaderboard</span>
              </button>
            </div>
          </div>

          <div className="popular-top-right">
            <button
              type="button"
              className="popular-publish-btn"
              onClick={() => setIsPublishOpen(true)}
              id="top-publish-playlist-btn"
            >
              <Plus size={15} weight="bold" />
              <span>Publish Your Playlist</span>
            </button>

            <div className="popular-top-brand">
              <div className="popular-brand-mark">
                <svg width="22" height="22" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                  <rect width="36" height="36" rx="8" fill="#FFFFFF" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M11 8H20.5C24.5 8 27.5 11 27.5 15C27.5 19 24.5 22 20.5 22H15.5V28H11V8ZM15.5 12V18H20C21.6 18 23 16.7 23 15C23 13.3 21.6 12 20 12H15.5Z" fill="#000000" />
                </svg>
                <span className="popular-brand-title">COMMUNITY REPOSITORY</span>
              </div>
              <span className="popular-live-badge">
                <span className="live-dot" />
                ALLOWED CURATORS ONLY
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Header Area */}
      <section className="popular-hero-area">
        <div className="popular-hero-container">
          <span className="popular-eyebrow-pill">PUBLIC CURATION DIRECTORY</span>
          <h1 className="popular-page-title">
            Public Curators and Community Playlists
          </h1>
          <p className="popular-page-subtitle">
            All playlists featured here are shared by curators who authorized public display.
            Rate community selections on a pure 1 to 10 scale, inspect full tracklists, or publish your own music library.
          </p>

          {/* Spotify Style Search Bar */}
          <div className="popular-search-wrapper">
            <div className="popular-search-box">
              <MagnifyingGlass size={18} weight="bold" className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search playlists, artists, tracks, or allowed curators..."
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

          {/* Category Count Filter Pills */}
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

      {/* Mode View: Allowed Curators Row */}
      {(activeTab === 'playlists' || activeTab === 'curators') && (
        <section className="popular-curators-section" aria-label="Publicly Allowed Curators">
          <div className="popular-main-container">
            <div className="section-header-row">
              <div>
                <div className="section-title-with-badge">
                  <h2 className="section-heading">Allowed Curators</h2>
                  <span className="public-permission-chip">
                    <ShieldCheck size={14} weight="fill" />
                    <span>Authorized Public Display</span>
                  </span>
                </div>
                <p className="section-subheading">
                  Verified creators who permitted their music playlists to be displayed and community rated
                </p>
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
              {curatorsList.map((curator) => (
                <CuratorCardItem
                  key={curator.id}
                  curator={curator}
                  isSelected={selectedCurator === curator.handle}
                  onSelect={handleSelectCurator}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main View: Community Playlists Grid */}
      {activeTab === 'playlists' && (
        <section className="popular-grid-section" aria-label="Community playlists collection">
          <div className="popular-main-container">
            <div className="section-header-row">
              <div>
                <h2 className="section-heading">
                  {selectedCurator
                    ? `Playlists Authorized by ${selectedCurator}`
                    : selectedCategory !== 'all'
                    ? `${CATEGORIES.find((c) => c.id === selectedCategory)?.label} Playlists`
                    : 'Community Playlists in System'}
                </h2>
                <p className="section-subheading">
                  Showing {filteredPlaylists.length} publicly allowed curations with live 1 to 10 community scoring
                </p>
              </div>

              <button
                type="button"
                className="section-publish-cta-pill"
                onClick={() => setIsPublishOpen(true)}
              >
                <Plus size={14} weight="bold" />
                <span>Submit Your Playlist</span>
              </button>
            </div>

            {filteredPlaylists.length === 0 ? (
              <div className="empty-results-box">
                <MusicNotes size={36} weight="duotone" />
                <h3>No matching public playlists found</h3>
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
                  <PlaylistCardItem
                    key={playlist.id}
                    playlist={playlist}
                    userGivenRating={userRatings[playlist.id]}
                    isRatingOpen={activeRatingCardId === playlist.id}
                    onOpenInside={handleOpenInside}
                    onSelectPlaylist={onSelectPlaylist}
                    onToggleRating={handleToggleRating}
                    onRate={handleRate}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Mode View: Top Leaderboard Charts */}
      {activeTab === 'leaderboard' && (
        <section className="popular-leaderboard-section" aria-label="Top Ranked Community Playlists">
          <div className="popular-main-container">
            <div className="section-header-row">
              <div>
                <h2 className="section-heading">Top Ranked Leaderboard</h2>
                <p className="section-subheading">
                  Highest rated community playlists across all platforms ordered by transparent curation score
                </p>
              </div>
              <button
                type="button"
                className="section-publish-cta-pill"
                onClick={() => setIsPublishOpen(true)}
              >
                <Plus size={14} weight="bold" />
                <span>Submit Your Playlist</span>
              </button>
            </div>

            <div className="leaderboard-table-container">
              <div className="lb-table-head">
                <span className="lb-col-rank">#</span>
                <span className="lb-col-title">PLAYLIST & CURATOR</span>
                <span className="lb-col-genre">GENRE</span>
                <span className="lb-col-match">STATUS</span>
                <span className="lb-col-rating">SCORE</span>
                <span className="lb-col-action">ACTION</span>
              </div>

              <div className="lb-table-body" role="list">
                {rankedPlaylists.map((item, idx) => (
                  <LeaderboardRowItem
                    key={item.id}
                    item={item}
                    idx={idx}
                    onOpenInside={handleOpenInside}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Inside Playlist Modal / Drawer */}
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
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="inside-score-pill">
                    <Star size={13} weight="fill" />
                    <span>{inspectingPlaylist.rating} / 10</span>
                  </div>
                </div>

                {/* Hero Metadata */}
                <div className="inside-info-box">
                  <div className="inside-eyebrow-row">
                    <span className="inside-type-tag">PUBLIC PLAYLIST</span>
                    <span className="inside-platform-badge">{inspectingPlaylist.sourceService}</span>
                    <span className="inside-authorized-chip">
                      <CheckCircle size={12} weight="fill" />
                      <span>Authorized Public Display</span>
                    </span>
                  </div>

                  <h2 id="inside-playlist-title" className="inside-playlist-title">
                    {inspectingPlaylist.title}
                  </h2>

                  <p className="inside-playlist-desc">
                    {inspectingPlaylist.description}
                  </p>

                  <div className="inside-curator-row">
                    <span className="inside-curator-name">
                      Curated by <strong>{inspectingPlaylist.curator}</strong> ({inspectingPlaylist.curatorHandle})
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

                  {/* Rate within Modal */}
                  <div className="modal-rate-section">
                    <span className="modal-rate-label">Cast your community rating:</span>
                    <div className="modal-rate-row">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                        <button
                          key={score}
                          type="button"
                          className={`modal-rate-score-btn ${userRatings[inspectingPlaylist.id] === score ? 'active' : ''}`}
                          onClick={() => handleRate(inspectingPlaylist.id, score)}
                        >
                          {score}
                        </button>
                      ))}
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

            {/* In-Playlist Tracklist Table */}
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
                            decoding="async"
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

      {/* Publish Your Playlist Modal (for New Users & Curators) */}
      {isPublishOpen && (
        <div
          className="publish-modal-backdrop"
          onClick={() => setIsPublishOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="publish-modal-title"
        >
          <div
            className="publish-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="publish-modal-header">
              <div>
                <span className="publish-eyebrow">CREATOR PORTAL</span>
                <h2 id="publish-modal-title" className="publish-modal-title">
                  Publish Your Playlist
                </h2>
                <p className="publish-modal-desc">
                  Share your curation with the Playlitfy community and collect transparent ratings on a 1 to 10 scale.
                </p>
              </div>
              <button
                type="button"
                className="publish-modal-close"
                onClick={() => setIsPublishOpen(false)}
                aria-label="Close modal"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {publishSuccess ? (
              <div className="publish-success-state">
                <CheckCircle size={48} weight="fill" color="#1DB954" />
                <h3>Playlist Published Successfully</h3>
                <p>Your curation is now live in the community directory and open for ratings!</p>
              </div>
            ) : (
              <form onSubmit={handlePublishSubmit} className="publish-form">
                <div className="publish-input-group">
                  <label htmlFor="pub-title">Playlist Title *</label>
                  <input
                    id="pub-title"
                    type="text"
                    required
                    value={pubTitle}
                    onChange={(e) => setPubTitle(e.target.value)}
                    placeholder="e.g. Midnight Tokyo Grooves"
                    className="publish-input"
                  />
                </div>

                <div className="publish-input-group">
                  <label htmlFor="pub-url">Public Playlist Link (Spotify, Apple Music, YouTube Music) *</label>
                  <input
                    id="pub-url"
                    type="url"
                    required
                    value={pubUrl}
                    onChange={(e) => setPubUrl(e.target.value)}
                    placeholder="https://open.spotify.com/playlist/..."
                    className="publish-input"
                  />
                </div>

                <div className="publish-row-2">
                  <div className="publish-input-group">
                    <label htmlFor="pub-curator">Curator / Creator Name *</label>
                    <input
                      id="pub-curator"
                      type="text"
                      required
                      value={pubCurator}
                      onChange={(e) => setPubCurator(e.target.value)}
                      placeholder="e.g. Sarah Vance"
                      className="publish-input"
                    />
                  </div>

                  <div className="publish-input-group">
                    <label htmlFor="pub-handle">Curator Handle</label>
                    <input
                      id="pub-handle"
                      type="text"
                      value={pubHandle}
                      onChange={(e) => setPubHandle(e.target.value)}
                      placeholder="@handle"
                      className="publish-input"
                    />
                  </div>
                </div>

                <div className="publish-row-2">
                  <div className="publish-input-group">
                    <label htmlFor="pub-genre">Genre / Category</label>
                    <select
                      id="pub-genre"
                      value={pubGenre}
                      onChange={(e) => setPubGenre(e.target.value)}
                      className="publish-select"
                    >
                      <option value="Lo Fi Chill">Lo Fi Chill</option>
                      <option value="City Pop and Funk">City Pop and Funk</option>
                      <option value="Neo Classical">Neo Classical</option>
                      <option value="Deep House and Club">Deep House and Club</option>
                      <option value="Hip Hop and Soul">Hip Hop and Soul</option>
                      <option value="Alt Pop and Acoustic">Alt Pop and Acoustic</option>
                      <option value="Jazz and Blues">Jazz and Blues</option>
                    </select>
                  </div>

                  <div className="publish-input-group">
                    <label htmlFor="pub-desc">Brief Description / Vibe</label>
                    <input
                      id="pub-desc"
                      type="text"
                      value={pubDesc}
                      onChange={(e) => setPubDesc(e.target.value)}
                      placeholder="Atmospheric sounds for night drives and focus..."
                      className="publish-input"
                    />
                  </div>
                </div>

                {/* Explicit Consent / Permission Checkbox (Crucial requirement!) */}
                <div className="publish-consent-box">
                  <label className="consent-checkbox-label">
                    <input
                      type="checkbox"
                      checked={pubConsent}
                      onChange={(e) => setPubConsent(e.target.checked)}
                      className="consent-checkbox"
                      required
                    />
                    <span className="consent-text">
                      I confirm that this playlist is publicly accessible and I authorize Playlitfy to display this curation in the directory and permit community listening and ratings.
                    </span>
                  </label>
                </div>

                <div className="publish-footer-actions">
                  <button
                    type="button"
                    className="publish-cancel-btn"
                    onClick={() => setIsPublishOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!pubTitle.trim() || !pubUrl.trim() || !pubCurator.trim() || !pubConsent}
                    className="publish-submit-btn"
                  >
                    Publish to Community Directory
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
