import { useState } from 'react';
import { featuredPlaylists, topRatedPlaylists } from '../data/playlists';
import PlaylistCard from './PlaylistCard';
import { useInView } from '../hooks/useAnimations';
import './Sections.css';

export default function PlaylistsSection() {
  const { ref, isInView } = useInView();
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allPlaylists = [...featuredPlaylists, ...topRatedPlaylists];

  const genres = ['All', 'Lo-fi / Chill', 'Indie / Alt', 'Techno / House', 'Jazz / Soul', 'Classical', 'Acoustic / Folk'];

  const filteredPlaylists = allPlaylists.filter((pl) => {
    const matchesGenre = selectedGenre === 'All' || pl.genre.toLowerCase().includes(selectedGenre.toLowerCase().split(' ')[0]);
    const matchesSearch = pl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pl.curator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pl.genre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <section id="playlists" className="section section--light" ref={ref}>
      <div className="section-inner">
        <div className="pill-badge pill-badge--dark">
          <span className="badge-dot dot-green" /> 10,000+ Curated Collections
        </div>

        <h2 className={`section-headline section-headline--dark ${isInView ? 'revealed' : ''}`}>
          Explore <span className="text-gradient-multi">Playlists</span>
        </h2>
        <p className="section-sub section-sub--dark">
          Hand-picked and rated by thousands of music lovers across the spatial web.
        </p>

        {/* Filter Controls */}
        <div className="playlists-filter-bar">
          <div className="playlists-search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search playlists, curators, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="playlists-search-input"
            />
          </div>

          <div className="playlists-genre-pills">
            {genres.map((genre) => (
              <button
                key={genre}
                className={`genre-pill ${selectedGenre === genre ? 'active' : ''}`}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Playlists Grid */}
        <div className={`playlist-grid ${isInView ? 'revealed' : ''}`}>
          {filteredPlaylists.length > 0 ? (
            filteredPlaylists.map((pl, i) => (
              <div key={pl.id} className="reveal-item" style={{ transitionDelay: `${(i % 6) * 0.06}s` }}>
                <PlaylistCard playlist={pl} />
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No playlists found matching "{searchQuery}"</p>
              <button className="btn-reset" onClick={() => { setSelectedGenre('All'); setSearchQuery(''); }}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
