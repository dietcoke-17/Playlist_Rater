import { useState } from 'react';
import { ArrowSquareOut, Star } from '@phosphor-icons/react';
import { topLeaderboardPlaylists, type Playlist } from '../data/playlists';
import './SpotifyLeaderboardSection.css';

interface SpotifyLeaderboardSectionProps {
  onOpenFullLeaderboard?: () => void;
  onSelectPlaylist?: (playlist: Playlist) => void;
}

export default function SpotifyLeaderboardSection({
  onOpenFullLeaderboard,
  onSelectPlaylist,
}: SpotifyLeaderboardSectionProps) {
  const [activeGenre, setActiveGenre] = useState('All Genres');

  const genres = ['All Genres', 'Lo-Fi Chill', 'City Pop & Funk', 'Neo Classical', 'Melodic Deep House', 'Midnight Jazz'];

  const filtered = topLeaderboardPlaylists.filter((p) => {
    if (activeGenre === 'All Genres') return true;
    return p.genre.toLowerCase().includes(activeGenre.toLowerCase().split(' ')[0]);
  });

  return (
    <section id="playlists" className="leaderboard-section" aria-label="Global playlist rankings">
      <div className="leaderboard-container">
        {/* Header */}
        <div className="leaderboard-header">
          <div className="leaderboard-title-col">
            <span className="leaderboard-kicker">GLOBAL CURATION CHARTS</span>
            <h2 className="leaderboard-heading">Current Leaderboard Standings</h2>
            <p className="leaderboard-subheading">
              Rankings update continuously as curators vote. Every score reflects listener ratings, track progression, and curation consistency.
            </p>
          </div>

          <div className="leaderboard-actions-col">
            {onOpenFullLeaderboard && (
              <button
                type="button"
                className="leaderboard-view-all-btn"
                onClick={onOpenFullLeaderboard}
              >
                <span>View Full Global Leaderboard</span>
                <ArrowSquareOut size={16} weight="bold" />
              </button>
            )}
          </div>
        </div>

        {/* Genre Pill Filter */}
        <div className="leaderboard-genre-row" role="tablist" aria-label="Genre selection">
          {genres.map((g) => (
            <button
              key={g}
              role="tab"
              aria-selected={activeGenre === g}
              className={`leaderboard-genre-btn ${activeGenre === g ? 'active' : ''}`}
              onClick={() => setActiveGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Spotify Charts Table */}
        <div className="leaderboard-table-shell">
          <div className="leaderboard-table-header" role="row">
            <span className="th-col th-rank">#</span>
            <span className="th-col th-title">PLAYLIST & CURATOR</span>
            <span className="th-col th-genre">GENRE</span>
            <span className="th-col th-platform">PLATFORM</span>
            <span className="th-col th-rating">SCORE</span>
            <span className="th-col th-actions">ACTIONS</span>
          </div>

          <div className="leaderboard-table-body" role="rowgroup">
            {filtered.slice(0, 6).map((playlist, idx) => (
              <div
                key={playlist.id}
                className="leaderboard-row"
                role="row"
                onClick={() => onSelectPlaylist?.(playlist)}
              >
                {/* Rank Number */}
                <span className="td-col td-rank">
                  {idx === 0 && <span className="rank-badge gold">01</span>}
                  {idx === 1 && <span className="rank-badge silver">02</span>}
                  {idx === 2 && <span className="rank-badge bronze">03</span>}
                  {idx > 2 && <span className="rank-badge normal">{String(idx + 1).padStart(2, '0')}</span>}
                </span>

                {/* Playlist & Curator */}
                <div className="td-col td-title">
                  <img
                    src={playlist.coverImage}
                    alt={playlist.title}
                    className="leaderboard-thumb"
                  />
                  <div className="title-details">
                    <span className="playlist-name">{playlist.title}</span>
                    <span className="curator-name">
                      {playlist.curator} <span className="curator-handle">{playlist.curatorHandle}</span>
                    </span>
                  </div>
                </div>

                {/* Genre */}
                <div className="td-col td-genre">
                  <span className="genre-pill">{playlist.genre}</span>
                </div>

                {/* Source Platform */}
                <div className="td-col td-platform">
                  <span className={`platform-pill ${playlist.sourceService.toLowerCase().replace(/\s+/g, '')}`}>
                    {playlist.sourceService}
                  </span>
                </div>

                {/* Community Score */}
                <div className="td-col td-rating">
                  <div className="score-pill">
                    <Star size={12} weight="fill" color="#1DB954" />
                    <span className="score-number">{playlist.rating}</span>
                    <span className="score-max">/ 10</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="td-col td-actions" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={playlist.sampleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="open-app-btn"
                    title={`Open in ${playlist.sourceService}`}
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
    </section>
  );
}
