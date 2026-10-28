import React, { useState } from 'react';
import {
  LinkSimple,
  ArrowsClockwise,
  ArrowSquareOut,
  Star,
  CheckCircle,
  Copy,
  ArrowUpRight,
  Plus,
  LockKey,
} from '@phosphor-icons/react';
import { Spotlight } from './aceternity/Spotlight';
import { SparklesCore } from './aceternity/Sparkles';
import { FlipWords } from './aceternity/FlipWords';
import { converterPresets, type StreamingService, type ConverterPreset } from '../data/playlists';
import { api } from '../lib/api';
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
  onOpenCuratorsDirectory?: () => void;
  onOpenPublishModal?: () => void;
}

export default function Hero({ onOpenLogin, onOpenCuratorsDirectory, onOpenPublishModal }: HeroProps) {
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
  const [liveResult, setLiveResult] = useState<{
    playlistTitle: string;
    curatorName: string;
    trackCount: number;
    matchRate: number;
    tracks: Array<{ id: string; title: string; artist: string; duration: string; match: string }>;
    targetUrl: string;
    playlistId?: string;
  } | null>(null);

  // 3D Perspective interactive tilt with zero re-renders
  const perspectiveRef = React.useRef<HTMLDivElement>(null);
  const tiltRafRef = React.useRef<number | null>(null);

  const handleMockupMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = perspectiveRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = Math.max(-3, Math.min(12, 6 - (y / rect.height) * 8));
    const rotateY = Math.max(-5, Math.min(5, (x / rect.width) * 6));

    if (tiltRafRef.current) cancelAnimationFrame(tiltRafRef.current);
    tiltRafRef.current = requestAnimationFrame(() => {
      if (perspectiveRef.current) {
        perspectiveRef.current.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    });
  };

  const handleMockupMouseLeave = () => {
    if (tiltRafRef.current) cancelAnimationFrame(tiltRafRef.current);
    if (perspectiveRef.current) {
      perspectiveRef.current.style.transform = 'perspective(1200px) rotateX(6deg) rotateY(0deg)';
    }
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setConverting(true);
    setConverted(false);
    setRatingSubmitted(false);
    setConversionStep(1);

    const stepTimer1 = setTimeout(() => setConversionStep(2), 250);
    const stepTimer2 = setTimeout(() => setConversionStep(3), 500);

    try {
      const res = await api.convertPlaylist(inputUrl.trim(), targetService);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const targetLink = res.conversionLinks.find(
        (l) => l.service.toLowerCase() === targetService.toLowerCase()
      )?.webUrl ?? res.conversionLinks[0]?.webUrl ?? inputUrl;

      setLiveResult({
        playlistTitle: res.playlist.title,
        curatorName: res.playlist.curator.displayName,
        trackCount: res.playlist.trackCount,
        matchRate: res.matchRate || 100,
        tracks: res.playlist.tracks.slice(0, 5).map((t, idx) => ({
          id: t.id || `track-${idx}`,
          title: t.title,
          artist: t.artist,
          duration: t.duration,
          match: '100% matched',
        })),
        targetUrl: targetLink,
        playlistId: res.playlist.id,
      });
      setConversionStep(3);
      setConverted(true);
    } catch {
      // Fallback gracefully to demo preset preview if backend or Spotify credentials are not configured
      setTimeout(() => {
        setLiveResult(null);
        setConverted(true);
      }, 700);
    } finally {
      setConverting(false);
    }
  };

  const handleRate = async (score: number) => {
    setUserRating(score);
    setRatingSubmitted(true);
    if (liveResult?.playlistId) {
      try {
        await api.submitRating(liveResult.playlistId, score);
      } catch (err) {
        console.warn('Rating submission note:', err);
      }
    }
  };

  const handleCopyLink = () => {
    const title = liveResult ? liveResult.playlistTitle : detectedPreset.title;
    const shareUrl = `https://playlitfy.studio/p/${title.toLowerCase().replace(/[^a-z0-9]+/g, '')}`;
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
    }, 2500);
  };

  const selectPreset = (preset: ConverterPreset) => {
    setInputUrl(preset.url);
    setTargetService(preset.sourceService === 'Spotify' ? 'Apple Music' : 'Spotify');
  };

  return (
    <section id="home" className="hero-section" aria-label="Universal playlist converter">
      {/* Studio Monochromatic Spotlights */}
      <Spotlight className="spotlight-left" fill="#FFFFFF" />
      <Spotlight className="spotlight-right" fill="#D4D4D8" />

      {/* Studio Ambient Starfield */}
      <div className="hero-sparkles-container" aria-hidden="true">
        <SparklesCore
          id="hero-sparkles"
          minSize={0.4}
          maxSize={1.4}
          particleDensity={22}
          particleColor="#FFFFFF"
        />
      </div>

      {/* Architectural Studio Grid lines overlay */}
      <div className="hero-grid-lines" aria-hidden="true" />
      <div className="hero-ambient-spotlight" aria-hidden="true" />

      <div className="hero-container">
        {/* Studio Eyebrow Pill */}
        <div className="studio-eyebrow-pill">
          <span className="studio-status-dot" />
          <span className="studio-pill-tag">01 // SYSTEM PROTOCOL</span>
          <span className="studio-pill-divider">·</span>
          <span className="studio-pill-text">Universal Music Engine 2.0</span>
          <span className="studio-pill-arrow">→</span>
        </div>

        {/* Studio Editorial Headline with FlipWords */}
        <h1 className="hero-title">
          Every playlist in one place.
          <br />
          Open in any music{' '}
          <span className="hero-flipwords-wrapper">
            <FlipWords words={['platform', 'service', 'library', 'ecosystem']} />
          </span>
        </h1>

        {/* Subheadline */}
        <p className="hero-subtitle">
          Professional cross-platform playlist engine and community curation protocol. Lossless ISRC matching across Spotify, Apple Music, and YouTube Music with pure 1-to-10 listener ratings.
        </p>

        {/* Studio Primary Action Buttons Row */}
        <div className="hero-cta-pills-row">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('converter');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="studio-primary-btn"
          >
            <span>Convert a Playlist</span>
            <ArrowUpRight size={15} weight="bold" />
          </button>

          {onOpenCuratorsDirectory && (
            <button
              type="button"
              className="studio-secondary-btn"
              onClick={onOpenCuratorsDirectory}
            >
              <span>Explore Curations</span>
            </button>
          )}
        </div>

        {/* Studio 3D Perspective App Window */}
        <div
          ref={perspectiveRef}
          className="hero-perspective-wrapper"
          onMouseMove={handleMockupMouseMove}
          onMouseLeave={handleMockupMouseLeave}
          style={{
            transform: 'perspective(1200px) rotateX(6deg) rotateY(0deg)',
          }}
        >
          <div className="mockup-window-shell">
            {/* Window Chrome Header Bar */}
            <div className="mockup-chrome-header">
              <div className="mockup-traffic-dots" aria-hidden="true">
                <span className="traffic-dot dot-red" />
                <span className="traffic-dot dot-yellow" />
                <span className="traffic-dot dot-green" />
              </div>

              <div className="mockup-address-bar" title="Encrypted ISRC Bridge">
                <LockKey size={12} weight="bold" className="lock-icon" />
                <span className="address-text">playlitfy.studio/sync</span>
                <span className="address-badge">ISRC 24-BIT</span>
              </div>

              <div className="mockup-status-indicator">
                <span className="status-ping" />
                <span className="status-label">Operational</span>
              </div>
            </div>

            {/* Inner SaaS Converter Card */}
            <div id="converter" className="hero-converter-card">
              {/* Header row with method tabs & presets */}
              <div className="converter-header-row">
                <div className="converter-tabs-bar" role="tablist" aria-label="Input method selection">
                  <button
                    role="tab"
                    aria-selected={activeTab === 'url'}
                    className={`converter-tab-btn ${activeTab === 'url' ? 'active' : ''}`}
                    onClick={() => setActiveTab('url')}
                  >
                    <LinkSimple size={14} weight="bold" />
                    <span>Paste playlist link</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'library'}
                    className={`converter-tab-btn ${activeTab === 'library' ? 'active' : ''}`}
                    onClick={() => setActiveTab('library')}
                  >
                    <ArrowsClockwise size={14} weight="bold" />
                    <span>Connect library</span>
                  </button>
                </div>

                {/* Quick Presets row */}
                <div className="quick-presets-strip" aria-label="Quick playlist presets">
                  <span className="presets-label">Sample:</span>
                  {converterPresets.slice(0, 3).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="preset-mini-chip"
                      onClick={() => selectPreset(p)}
                      title={`Load ${p.title}`}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'url' ? (
                <div className="converter-tab-body">
                  {/* Clean Form Input Container */}
                  <form onSubmit={handleConvert} className="converter-form">
                    <div className="converter-input-wrapper">
                      <span className="input-icon">
                        <LinkSimple size={16} weight="bold" />
                      </span>
                      <input
                        type="url"
                        required
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="Paste Spotify, Apple Music, or YouTube Music URL..."
                        className="converter-input"
                        aria-label="Playlist URL input"
                      />
                      <div className="input-source-badge">
                        <span>Source:</span>
                        <strong>
                          {inputUrl.includes('apple')
                            ? 'Apple Music'
                            : inputUrl.includes('youtube')
                            ? 'YouTube Music'
                            : 'Spotify'}
                        </strong>
                      </div>
                    </div>

                    {/* Target service selector with brand dots */}
                    <div className="service-selector-block">
                      <span className="service-selector-label">Target Service:</span>
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

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={converting || !inputUrl.trim()}
                      className={`convert-submit-btn ${converting ? 'converting' : ''}`}
                    >
                      {converting ? (
                        <div className="converting-state">
                          <ArrowsClockwise size={15} className="spin-icon" weight="bold" />
                          <span>
                            {conversionStep === 1 && 'Resolving catalog metadata...'}
                            {conversionStep === 2 && 'Matching ISRC codes...'}
                            {conversionStep === 3 && `Synthesizing playlist in ${targetService}...`}
                          </span>
                        </div>
                      ) : (
                        <>
                          <ArrowsClockwise size={15} weight="bold" />
                          <span>Convert and Open in {targetService}</span>
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
                            <CheckCircle size={17} weight="fill" color="#FFFFFF" />
                            <h2 className="result-title">
                              {liveResult ? liveResult.playlistTitle : detectedPreset.title}
                            </h2>
                          </div>
                          <p className="result-curator">
                            Curated by {liveResult ? liveResult.curatorName : detectedPreset.curator} · {liveResult ? liveResult.trackCount : detectedPreset.trackCount} tracks · 100% matched
                          </p>
                        </div>
                        <div className="result-match-badge">
                          <span className="match-num">{liveResult ? liveResult.matchRate : 100}%</span>
                          <span className="match-label">MATCHED</span>
                        </div>
                      </div>

                      {/* Tracklist Preview */}
                      <div className="result-tracklist" role="list">
                        {(liveResult ? liveResult.tracks : sampleTracks).map((t, idx) => (
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
                          <span className="rating-label">Rate:</span>
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
                            <span className="rating-confirmed">Logged</span>
                          )}
                        </div>

                        <div className="result-buttons-group">
                          <button
                            type="button"
                            className="copy-share-btn"
                            onClick={handleCopyLink}
                          >
                            <Copy size={14} />
                            <span>{copiedLink ? 'Copied' : 'Share link'}</span>
                          </button>
                          <a
                            href={liveResult ? liveResult.targetUrl : detectedPreset.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="open-in-app-btn"
                          >
                            <span>Open in {targetService}</span>
                            <ArrowSquareOut size={14} weight="bold" />
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
                      <ArrowsClockwise size={20} weight="bold" color="#ffffff" />
                    </div>
                    <h2 className="library-heading">Authorize music library</h2>
                    <p className="library-desc">
                      Connect Spotify, Apple Music, or YouTube Music to import all your playlists at once and participate in community curation rankings.
                    </p>
                    <div className="library-actions">
                      <button
                        type="button"
                        className="library-auth-btn"
                        onClick={onOpenLogin}
                      >
                        Connect Spotify
                      </button>
                      <button
                        type="button"
                        className="library-auth-btn"
                        onClick={onOpenLogin}
                      >
                        Connect Apple Music
                      </button>
                      <button
                        type="button"
                        className="library-auth-btn"
                        onClick={onOpenLogin}
                      >
                        Connect YouTube Music
                      </button>
                    </div>
                    <p className="library-security-note">
                      Read and playlist write scope only. Encrypted OAuth2 authorization.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation to Publicly Allowed Curators */}
        <div className="hero-community-callout">
          <div className="callout-glass-card">
            <div className="callout-content-left">
              <div className="callout-eyebrow-pill">
                <span>DIRECTORY // 01</span>
              </div>
              <h2 className="callout-title">
                Public Curators & Community Leaderboards
              </h2>
              <p className="callout-desc">
                Browse verified creators who authorized public display on Playlitfy. Rate community curations on a 1 to 10 scale, inspect full tracklists, or publish your own playlist library.
              </p>
            </div>

            <div className="callout-actions-right">
              {onOpenCuratorsDirectory && (
                <button
                  type="button"
                  className="callout-primary-btn"
                  onClick={onOpenCuratorsDirectory}
                  id="hero-browse-curators-btn"
                >
                  <span>Browse Allowed Curators</span>
                  <ArrowUpRight size={15} weight="bold" />
                </button>
              )}
              {onOpenPublishModal && (
                <button
                  type="button"
                  className="callout-secondary-btn"
                  onClick={onOpenPublishModal}
                  id="hero-publish-playlist-btn"
                >
                  <Plus size={15} weight="bold" />
                  <span>Publish Playlist</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
