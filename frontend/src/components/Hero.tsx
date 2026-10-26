import { useState } from 'react';
import {
  LinkSimple,
  ArrowsClockwise,
  ArrowSquareOut,
  Star,
  CheckCircle,
  Play,
  ShareNetwork,
} from '@phosphor-icons/react';
import { converterPresets, type StreamingService } from '../data/playlists';
import './Hero.css';

const SERVICES: { name: StreamingService; color: string; bg: string }[] = [
  { name: 'Apple Music', color: '#FA2D48', bg: 'rgba(250, 45, 72, 0.12)' },
  { name: 'Spotify', color: '#1DB954', bg: 'rgba(29, 185, 84, 0.12)' },
  { name: 'YouTube Music', color: '#FF0000', bg: 'rgba(255, 0, 0, 0.12)' },
  { name: 'TIDAL', color: '#00FFFF', bg: 'rgba(0, 255, 255, 0.12)' },
  { name: 'Amazon Music', color: '#00A8E1', bg: 'rgba(0, 168, 225, 0.12)' },
  { name: 'SoundCloud', color: '#FF5500', bg: 'rgba(255, 85, 0, 0.12)' },
];

export default function Hero() {
  const [activeTab, setActiveTab] = useState<'url' | 'library'>('url');
  const [inputUrl, setInputUrl] = useState(converterPresets[0].url);
  const [detectedPreset, setDetectedPreset] = useState(converterPresets[0]);
  const [targetService, setTargetService] = useState<StreamingService>('Apple Music');
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Quick preset selector
  const handleSelectPreset = (preset: typeof converterPresets[0]) => {
    setInputUrl(preset.url);
    setDetectedPreset(preset);
    setConverted(false);
    setUserRating(null);
    setRatingSubmitted(false);
    // Default target to a different service
    if (preset.sourceService === 'Apple Music') {
      setTargetService('Spotify');
    } else {
      setTargetService('Apple Music');
    }
  };

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setConverting(true);
    setConverted(false);
    setRatingSubmitted(false);

    setTimeout(() => {
      setConverting(false);
      setConverted(true);
    }, 700);
  };

  const handleRate = (score: number) => {
    setUserRating(score);
    setRatingSubmitted(true);
  };

  const scrollToLeaderboard = () => {
    const el = document.getElementById('playlists');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero-section" aria-label="Introduction and universal playlist converter">
      <div className="hero-container">
        {/* Category Pill */}
        <div className="hero-pill-badge" role="status">
          <span className="hero-pill-dot" aria-hidden="true" />
          <span>Universal playlist hub · Cross platform music bridge</span>
        </div>

        {/* Headline — left to right gradient text (#FFFFFF → #9B9B9B), max width 680px, no hyphens */}
        <h1 className="hero-title">
          Every playlist in one place.
          <br />
          Open in any music app.
        </h1>

        {/* Subheadline — max width 680px, no hyphens, clear value proposition */}
        <p className="hero-subtitle">
          Fetch any public or authorized playlist from Spotify, Apple Music, or YouTube Music.
          Open directly in your personal player, convert across platforms with one click,
          and discover community rated curation on a pure 1 to 10 scale.
        </p>

        {/* Universal Converter & Importer Card */}
        <div id="converter" className="hero-converter-card">
          {/* Card header tabs */}
          <div className="converter-tabs-bar" role="tablist" aria-label="Input method selection">
            <button
              role="tab"
              aria-selected={activeTab === 'url'}
              className={`converter-tab-btn ${activeTab === 'url' ? 'active' : ''}`}
              onClick={() => setActiveTab('url')}
            >
              <LinkSimple size={16} weight="bold" />
              <span>Paste playlist link</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'library'}
              className={`converter-tab-btn ${activeTab === 'library' ? 'active' : ''}`}
              onClick={() => setActiveTab('library')}
            >
              <ArrowsClockwise size={16} weight="bold" />
              <span>Connect personal library</span>
            </button>
          </div>

          {activeTab === 'url' ? (
            <div className="converter-tab-body">
              {/* Presets row */}
              <div className="presets-row">
                <span className="presets-label">Try sample:</span>
                <div className="presets-buttons">
                  {converterPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      className={`preset-chip ${detectedPreset.id === preset.id ? 'active' : ''}`}
                      onClick={() => handleSelectPreset(preset)}
                    >
                      <span className="preset-chip-dot" />
                      <span>{preset.label}</span>
                      <span className="preset-source-badge">({preset.sourceService})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* URL Form */}
              <form onSubmit={handleConvert} className="converter-form">
                <div className="converter-input-wrapper">
                  <div className="converter-input-icon">
                    <LinkSimple size={20} weight="bold" />
                  </div>
                  <input
                    type="url"
                    className="converter-url-input"
                    value={inputUrl}
                    onChange={(e) => {
                      setInputUrl(e.target.value);
                      setConverted(false);
                    }}
                    placeholder="Paste Spotify, Apple Music, or YouTube Music playlist link"
                    required
                    aria-label="Playlist URL input"
                  />
                  <div className="detected-service-tag">
                    <span>Source:</span>
                    <strong>{detectedPreset.sourceService}</strong>
                  </div>
                </div>

                {/* Target service selection */}
                <div className="target-service-row">
                  <span className="target-service-label">Convert and open in:</span>
                  <div className="target-service-chips" role="radiogroup" aria-label="Target music app">
                    {SERVICES.map((s) => (
                      <button
                        key={s.name}
                        type="button"
                        role="radio"
                        aria-checked={targetService === s.name}
                        className={`target-service-chip ${targetService === s.name ? 'selected' : ''}`}
                        onClick={() => {
                          setTargetService(s.name);
                          setConverted(false);
                        }}
                      >
                        <span
                          className="service-color-indicator"
                          style={{ backgroundColor: s.color }}
                          aria-hidden="true"
                        />
                        <span>{s.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Convert Submit Button */}
                <button
                  type="submit"
                  className="converter-submit-btn"
                  disabled={converting}
                >
                  {converting ? (
                    <>
                      <ArrowsClockwise size={18} weight="bold" className="spin-icon" />
                      <span>Matching tracks across {targetService} catalogue...</span>
                    </>
                  ) : (
                    <>
                      <ArrowsClockwise size={18} weight="bold" />
                      <span>Convert and open in {targetService}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Conversion Result Preview */}
              {converted && (
                <div className="conversion-result-card" role="region" aria-label="Conversion result">
                  <div className="result-top">
                    <div className="result-status-pill">
                      <CheckCircle size={16} weight="fill" color="#3EC96A" />
                      <span>{detectedPreset.matchRate}% catalogue match</span>
                      <span className="result-pill-sep">·</span>
                      <span>{detectedPreset.trackCount} of {detectedPreset.trackCount} tracks synced</span>
                    </div>
                  </div>

                  <div className="result-main-grid">
                    <div className="result-playlist-info">
                      <div className="result-cover-box">
                        <Play size={24} weight="fill" />
                      </div>
                      <div className="result-meta">
                        <h2 className="result-title">{detectedPreset.title}</h2>
                        <p className="result-curator">Curated by {detectedPreset.curator}</p>
                        <div className="result-rating-row">
                          <span className="result-score-badge">
                            <Star size={14} weight="fill" color="#FF5500" />
                            <strong>9.4</strong> / 10
                          </span>
                          <span className="result-review-count">2,847 community ratings</span>
                        </div>
                      </div>
                    </div>

                    <div className="result-actions">
                      <a
                        href={detectedPreset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="open-target-btn"
                      >
                        <ArrowSquareOut size={18} weight="bold" />
                        <span>Launch in {targetService}</span>
                      </a>
                      <a
                        href={detectedPreset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="open-source-btn"
                      >
                        <span>Open original on {detectedPreset.sourceService}</span>
                      </a>
                    </div>
                  </div>

                  {/* Inline 1 to 10 rater widget */}
                  <div className="result-inline-rater">
                    <div className="rater-heading">
                      <span>Rate this curation:</span>
                      {ratingSubmitted && (
                        <span className="rating-saved-label">Vote recorded in global charts</span>
                      )}
                    </div>
                    <div className="rater-buttons-strip">
                      {[6, 7, 8, 9, 10].map((score) => (
                        <button
                          key={score}
                          type="button"
                          className={`score-btn ${userRating === score ? 'active' : ''}`}
                          onClick={() => handleRate(score)}
                          aria-label={`Rate ${score} out of 10`}
                        >
                          {score}.0
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="converter-tab-body">
              <div className="library-connect-grid">
                <div className="library-service-card connected">
                  <div className="service-header">
                    <div className="service-badge spotify-badge">Spotify</div>
                    <span className="service-status">Connected</span>
                  </div>
                  <p className="service-details">42 public playlists · 860 saved tracks imported</p>
                  <button type="button" className="service-action-btn synced">
                    <CheckCircle size={16} weight="fill" />
                    <span>Sync active</span>
                  </button>
                </div>

                <div className="library-service-card">
                  <div className="service-header">
                    <div className="service-badge apple-badge">Apple Music</div>
                    <span className="service-status pending">Ready to link</span>
                  </div>
                  <p className="service-details">Import your iCloud Music Library playlists in one tap</p>
                  <button type="button" className="service-action-btn">
                    <span>Link Apple account</span>
                  </button>
                </div>

                <div className="library-service-card">
                  <div className="service-header">
                    <div className="service-badge youtube-badge">YouTube Music</div>
                    <span className="service-status pending">Ready to link</span>
                  </div>
                  <p className="service-details">Fetch your channel playlists and mix uploads</p>
                  <button type="button" className="service-action-btn">
                    <span>Link Google account</span>
                  </button>
                </div>
              </div>
              <p className="library-privacy-note">
                PlaylistIQ uses standard read access to sync your public track lists. We never modify your listening libraries without explicit permission.
              </p>
            </div>
          )}

          {/* Supported platform icons ribbon */}
          <div className="supported-services-bar">
            <span className="supported-label">Universal connection across:</span>
            <div className="services-logos-list">
              {SERVICES.map((s) => (
                <div key={s.name} className="service-logo-pill">
                  <span className="service-dot" style={{ backgroundColor: s.color }} aria-hidden="true" />
                  <span>{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Secondary Navigation to Charts */}
        <div className="hero-secondary-action">
          <button className="browse-leaderboard-btn" onClick={scrollToLeaderboard}>
            <ShareNetwork size={18} weight="bold" />
            <span>Explore top community rated playlists</span>
          </button>
        </div>

        {/* Proof Strip */}
        <div className="hero-proof-strip" aria-label="Key platform metrics">
          <span>84,200 playlists converted</span>
          <span className="proof-sep" aria-hidden="true">·</span>
          <span>98.4% catalogue match rate</span>
          <span className="proof-sep" aria-hidden="true">·</span>
          <span>14,800 active curators</span>
          <span className="proof-sep" aria-hidden="true">·</span>
          <span>Pure 1 to 10 rating scale</span>
        </div>
      </div>
    </section>
  );
}
