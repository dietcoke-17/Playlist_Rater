import { useState } from 'react';
import { ArrowLeft, ArrowSquareOut, Star } from '@phosphor-icons/react';
import { topLeaderboardPlaylists, type Playlist } from '../data/playlists';
import './LeaderboardPage.css';

interface LeaderboardPageProps {
  onBack: () => void;
  onSelectPlaylist?: (playlist: Playlist) => void;
}

const ALL_GENRES = [
  'All Genres',
  'Lo-Fi Chill',
  'City Pop & Funk',
  'Neo Classical',
  'Melodic Deep House',
  'Acoustic & Folk',
  'Leftfield & Ambient',
  'Midnight Jazz',
  'Synthwave & Retrowave',
];

export default function LeaderboardPage({ onBack, onSelectPlaylist }: LeaderboardPageProps) {
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = topLeaderboardPlaylists.filter((p) => {
    const matchesGenre = selectedGenre === 'All Genres' || p.genre.toLowerCase().includes(selectedGenre.toLowerCase().split(' ')[0]);
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.curator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="full-leaderboard-root">
      {/* Top Navigation Bar */}
      <header className="full-leaderboard-navbar">
        <div className="full-leaderboard-nav-container">
          <button
            type="button"
            className="full-lb-back-btn"
            onClick={onBack}
            id="leaderboard-back-btn"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Back to Hub</span>
          </button>

          <div className="full-lb-brand">
            <span className="full-lb-brand-title">PLAYLITFY CHARTS</span>
            <span className="full-lb-live-pill">
              <span className="live-dot" />
              LIVE RANKINGS
            </span>
          </div>
        </div>
      </header>

      {/* Hero Banner for Leaderboard */}
      <section className="full-lb-hero">
        <div className="full-lb-hero-container">
          <span className="full-lb-badge">COMMUNITY CURATION ENGINE</span>
          <h1 className="full-lb-title">Global Playlist Leaderboard</h1>
          <p className="full-lb-subtitle">
            The definitive cross platform ranking of music curation. Scores are calculated from verified listener ratings, trackflow consistency, and completion rate.
          </p>

          {/* Search Input */}
          <div className="full-lb-search-box">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search playlist title, curator name, or keyword..."
              className="full-lb-search-input"
            />
          </div>
        </div>
      </section>

      {/* Main Table Content */}
      <main className="full-lb-main">
        <div className="full-lb-container">
          {/* Genre Filter Scroll */}
          <div className="full-lb-genres-bar" role="tablist" aria-label="Genre filters">
            {ALL_GENRES.map((g) => (
              <button
                key={g}
                role="tab"
                aria-selected={selectedGenre === g}
                className={`full-lb-genre-btn ${selectedGenre === g ? 'active' : ''}`}
                onClick={() => setSelectedGenre(g)}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Spotify Standard Charts Table */}
          <div className="full-lb-table-wrapper">
            <div className="full-lb-table-head" role="row">
              <span className="flb-th flb-rank">#</span>
              <span className="flb-th flb-title">COLLECTION & CURATOR</span>
              <span className="flb-th flb-genre">GENRE</span>
              <span className="flb-th flb-platform">PLATFORM</span>
              <span className="flb-th flb-stats">RATINGS</span>
              <span className="flb-th flb-score">SCORE</span>
              <span className="flb-th flb-action">ACTION</span>
            </div>

            <div className="full-lb-table-body" role="rowgroup">
              {filtered.map((playlist, idx) => (
                <div
                  key={playlist.id}
                  className="full-lb-row"
                  role="row"
                  onClick={() => onSelectPlaylist?.(playlist)}
                >
                  {/* Rank */}
                  <span className="flb-td flb-rank">
                    {idx === 0 && <span className="flb-rank-badge gold">01</span>}
                    {idx === 1 && <span className="flb-rank-badge silver">02</span>}
                    {idx === 2 && <span className="flb-rank-badge bronze">03</span>}
                    {idx > 2 && <span className="flb-rank-badge normal">{String(idx + 1).padStart(2, '0')}</span>}
                  </span>

                  {/* Title & Curator */}
                  <div className="flb-td flb-title">
                    <img
                      src={playlist.coverImage}
                      alt={playlist.title}
                      className="flb-cover-img"
                    />
                    <div className="flb-text-group">
                      <span className="flb-playlist-name">{playlist.title}</span>
                      <span className="flb-curator-name">
                        by {playlist.curator} <span className="flb-handle">{playlist.curatorHandle}</span>
                      </span>
                    </div>
                  </div>

                  {/* Genre */}
                  <div className="flb-td flb-genre">
                    <span className="flb-genre-pill">{playlist.genre}</span>
                  </div>

                  {/* Platform */}
                  <div className="flb-td flb-platform">
                    <span className={`flb-platform-badge ${playlist.sourceService.toLowerCase().replace(/\s+/g, '')}`}>
                      {playlist.sourceService}
                    </span>
                  </div>

                  {/* Rating Count */}
                  <div className="flb-td flb-stats">
                    <span className="flb-reviews-count">{playlist.reviewCount.toLocaleString()} votes</span>
                  </div>

                  {/* Score */}
                  <div className="flb-td flb-score">
                    <div className="flb-score-chip">
                      <Star size={13} weight="fill" color="#1DB954" />
                      <span className="flb-score-val">{playlist.rating}</span>
                      <span className="flb-score-base">/ 10</span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flb-td flb-action" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={playlist.sampleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flb-open-btn"
                    >
                      <span>Open</span>
                      <ArrowSquareOut size={14} weight="bold" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
