import { useState } from 'react';
import {
  LinkSimple,
  ArrowsClockwise,
  ArrowSquareOut,
  Star,
  CheckCircle,
  Copy,
} from '@phosphor-icons/react';
import { converterPresets, type StreamingService, type ConverterPreset } from '../data/playlists';
import './Hero.css';

const SERVICES: { name: StreamingService; color: string }[] = [
  { name: 'Apple Music', color: '#FA2D48' },
  { name: 'Spotify', color: '#1DB954' },
  { name: 'YouTube Music', color: '#FF0000' },
  { name: 'Amazon Music', color: '#00A8E1' },
  { name: 'TIDAL', color: '#00FFFF' },
];

const sampleTracks = [
  { id: 't1', title: 'Midnight City', artist: 'M83', duration: '4:04', match: '100% matched' },
  { id: 't2', title: 'Resonance', artist: 'HOME', duration: '3:32', match: '100% matched' },
  { id: 't3', title: 'Sunset Lover', artist: 'Petit Biscuit', duration: '3:58', match: '100% matched' },
];

interface HeroProps {
  onOpenLogin?: () => void;
}

export default function Hero({ onOpenLogin }: HeroProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'library'>('url');
  const [inputUrl, setInputUrl] = useState('https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6');
  const [detectedPreset] = useState<ConverterPreset>(converterPresets[0]);
  const [targetService, setTargetService] = useState<StreamingService>('Apple Music');
  const [converting, setConverting] = useState(false);
  const [conversionStep, setConversionStep] = useState(0);
  const [converted, setConverted] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setConverting(true);
    setConverted(false);
    setRatingSubmitted(false);
    setConversionStep(1);

    setTimeout(() => {
      setConversionStep(2);
    }, 350);

    setTimeout(() => {
      setConversionStep(3);
    }, 700);

    setTimeout(() => {
      setConverting(false);
      setConverted(true);
    }, 950);
  };

  const handleRate = (score: number) => {
    setUserRating(score);
    setRatingSubmitted(true);
  };

  const handleCopyLink = () => {
    const shareUrl = `https://playlitfy.com/p/${detectedPreset.title.toLowerCase().replace(/[^a-z0-9]+/g, '')}`;
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
    }, 2500);
  };

  return (
    <section id="home" className="hero-section" aria-label="Universal playlist converter">
      {/* Timmo style subtle graphic grid lines overlay */}
      <div className="hero-grid-lines" aria-hidden="true" />
      <div className="hero-ambient-spotlight" aria-hidden="true" />

      <div className="hero-container">
        {/* Sleek confident headline */}
        <h1 className="hero-title">
          Every playlist in one place.
          <br />
          Open in any music app.
        </h1>

        {/* Minimal, necessary subheadline */}
        <p className="hero-subtitle">
          Your music, your way. Universal playlist conversion across Spotify, Apple Music, and YouTube Music.
          One click transfer with community curation ratings on a pure 1 to 10 scale.
        </p>

        {/* Minimalist SaaS Converter Box */}
        <div className="converter-card-shell">
          <div id="converter" className="hero-converter-card">
            {/* Header row with only the method tabs */}
            <div className="converter-header-row">
              <div className="converter-tabs-bar" role="tablist" aria-label="Input method selection">
                <button
                  role="tab"
                  aria-selected={activeTab === 'url'}
                  className={`converter-tab-btn ${activeTab === 'url' ? 'active' : ''}`}
                  onClick={() => setActiveTab('url')}
                >
                  <LinkSimple size={15} weight="bold" />
                  <span>Paste playlist link</span>
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'library'}
                  className={`converter-tab-btn ${activeTab === 'library' ? 'active' : ''}`}
                  onClick={() => setActiveTab('library')}
                >
                  <ArrowsClockwise size={15} weight="bold" />
                  <span>Connect library</span>
                </button>
              </div>
            </div>

            {activeTab === 'url' ? (
              <div className="converter-tab-body">
                {/* Clean Form Input Container */}
                <form onSubmit={handleConvert} className="converter-form">
                  <div className="converter-input-wrapper">
                    <span className="input-icon">
                      <LinkSimple size={18} weight="bold" />
                    </span>
                    <input
                      type="url"
                      required
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="Paste any Spotify, Apple Music, or YouTube Music URL"
                      className="converter-input"
                      aria-label="Playlist URL input"
                    />
                    <div className="input-source-badge">
                      <span>Source:</span>
                      <strong>{inputUrl.includes('apple') ? 'Apple Music' : inputUrl.includes('youtube') ? 'YouTube Music' : 'Spotify'}</strong>
                    </div>
                  </div>

                  {/* Target service selector with Timmo refined styling */}
                  <div className="service-selector-block">
                    <span className="service-selector-label">Convert and open in:</span>
                    <div className="service-pills-row" role="radiogroup" aria-label="Target streaming service">
                      {SERVICES.map((s) => (
                        <button
                          key={s.name}
                          type="button"
                          role="radio"
                          aria-checked={targetService === s.name}
                          className={`service-pill-btn ${targetService === s.name ? 'active' : ''}`}
                          onClick={() => setTargetService(s.name)}
                        >
                          <span className="service-color-dot" style={{ backgroundColor: s.color }} />
                          <span>{s.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timmo Style Premium Action Button (Clean High Contrast White Pill) */}
                  <button
                    type="submit"
                    disabled={converting || !inputUrl.trim()}
                    className={`convert-submit-btn ${converting ? 'converting' : ''}`}
                  >
                    {converting ? (
                      <div className="converting-state">
                        <ArrowsClockwise size={16} className="spin-icon" weight="bold" />
                        <span>
                          {conversionStep === 1 && 'Resolving catalogue...'}
                          {conversionStep === 2 && 'Matching ISRC codes...'}
                          {conversionStep === 3 && `Building playlist in ${targetService}...`}
                        </span>
                      </div>
                    ) : (
                      <>
                        <ArrowsClockwise size={16} weight="bold" />
                        <span>Convert and open in {targetService}</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Conversion Result Pane */}
                {converted && (
                  <div className="conversion-result-card" role="region" aria-label="Conversion results">
                    <div className="result-header">
                      <div className="result-meta">
                        <div className="result-title-row">
                          <CheckCircle size={18} weight="fill" color="#ffffff" />
                          <h2 className="result-title">{detectedPreset.title}</h2>
                        </div>
                        <p className="result-curator">
                          Curated by {detectedPreset.curator} · {detectedPreset.trackCount} tracks · 100% matched
                        </p>
                      </div>
                      <div className="result-match-badge">
                        <span className="match-num">100%</span>
                        <span className="match-label">MATCHED</span>
                      </div>
                    </div>

                    {/* Tracklist Preview */}
                    <div className="result-tracklist" role="list">
                      {sampleTracks.map((t, idx) => (
                        <div key={t.id} className="result-track-row" role="listitem">
                          <span className="track-idx">{idx + 1}</span>
                          <div className="track-info">
                            <span className="track-name">{t.title}</span>
                            <span className="track-artist">{t.artist}</span>
                          </div>
                          <span className="track-match-tag">{t.match}</span>
                          <span className="track-dur">{t.duration}</span>
                        </div>
                      ))}
                    </div>

                    {/* Rating and Direct App Launch */}
                    <div className="result-action-bar">
                      <div className="rating-box">
                        <span className="rating-label">Rate curation:</span>
                        <div className="rating-stars">
                          {[7, 8, 9, 10].map((num) => (
                            <button
                              key={num}
                              type="button"
                              className={`rating-pill-btn ${userRating === num ? 'selected' : ''}`}
                              onClick={() => handleRate(num)}
                            >
                              <Star size={11} weight={userRating && userRating >= num ? 'fill' : 'bold'} />
                              <span>{num}.0</span>
                            </button>
                          ))}
                        </div>
                        {ratingSubmitted && (
                          <span className="rating-confirmed">Vote recorded</span>
                        )}
                      </div>

                      <div className="result-buttons-group">
                        <button
                          type="button"
                          className="copy-share-btn"
                          onClick={handleCopyLink}
                        >
                          <Copy size={15} />
                          <span>{copiedLink ? 'Link copied' : 'Share link'}</span>
                        </button>
                        <a
                          href={detectedPreset.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="open-in-app-btn"
                        >
                          <span>Open in {targetService}</span>
                          <ArrowSquareOut size={15} weight="bold" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Connect Library Tab */
              <div className="library-connect-tab">
                <div className="library-info-block">
                  <div className="library-icon-pill">
                    <ArrowsClockwise size={22} weight="bold" color="#ffffff" />
                  </div>
                  <h2 className="library-heading">Authorize music library</h2>
                  <p className="library-desc">
                    Connect Spotify, Apple Music, or YouTube Music to import all your playlists at once and participate in community curation rankings.
                  </p>
                  <div className="library-actions">
                    <button
                      type="button"
                      className="library-auth-btn spotify"
                      onClick={onOpenLogin}
                    >
                      Connect Spotify
                    </button>
                    <button
                      type="button"
                      className="library-auth-btn apple"
                      onClick={onOpenLogin}
                    >
                      Connect Apple Music
                    </button>
                    <button
                      type="button"
                      className="library-auth-btn youtube"
                      onClick={onOpenLogin}
                    >
                      Connect YouTube Music
                    </button>
                  </div>
                  <p className="library-security-note">
                    Read and playlist write scope only. Secure authentication.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
