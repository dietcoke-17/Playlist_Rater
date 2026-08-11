import type { Playlist } from '../data/playlists';
import './PlaylistCard.css';

interface PlaylistCardProps {
  playlist: Playlist;
  rank?: number;
  variant?: 'featured' | 'compact';
}

export default function PlaylistCard({ playlist, rank, variant = 'featured' }: PlaylistCardProps) {
  const ratingColor =
    playlist.rating >= 9 ? '#1DB954' :
    playlist.rating >= 8 ? '#FACC15' :
    '#FF6B35';

  if (variant === 'compact') {
    return (
      <div className="playlist-card playlist-card--compact" id={`playlist-${playlist.id}`}>
        {rank !== undefined && <div className="playlist-rank">{rank}</div>}
        <div
          className="playlist-cover playlist-cover--sm"
          style={{ background: `linear-gradient(135deg, ${playlist.coverGradient[0]}, ${playlist.coverGradient[1]})` }}
        >
          <span className="playlist-cover__icon">{playlist.coverIcon}</span>
        </div>
        <div className="playlist-info">
          <h4 className="playlist-title--sm">{playlist.title}</h4>
          <p className="playlist-meta--sm">{playlist.genre} · {playlist.trackCount} tracks</p>
        </div>
        <div className="playlist-score" style={{ borderColor: ratingColor, color: ratingColor }}>
          {playlist.rating.toFixed(1)}
        </div>
      </div>
    );
  }

  return (
    <div className="playlist-card" id={`playlist-${playlist.id}`}>
      <div
        className="playlist-cover"
        style={{ background: `linear-gradient(135deg, ${playlist.coverGradient[0]}, ${playlist.coverGradient[1]})` }}
      >
        <span className="playlist-cover__icon">{playlist.coverIcon}</span>
        <div className="playlist-cover__rating" style={{ background: ratingColor }}>
          ★ {playlist.rating.toFixed(1)}
        </div>
      </div>
      <div className="playlist-body">
        <h3 className="playlist-title">{playlist.title}</h3>
        <p className="playlist-curator">by {playlist.curator}</p>
        <div className="playlist-meta">
          <span className="playlist-genre">{playlist.genre}</span>
          <span className="playlist-dot">·</span>
          <span>{playlist.trackCount} tracks</span>
          <span className="playlist-dot">·</span>
          <span>{playlist.duration}</span>
        </div>
        <div className="playlist-reviews">
          {playlist.reviewCount.toLocaleString()} reviews
        </div>
      </div>
    </div>
  );
}
