import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Waves, ExternalLink, CheckCircle2, Star, Check } from 'lucide-react';
import { FollowerPointerCard } from './FollowingPointer';
import './BentoGrid.css';

export const BentoGrid: React.FC = () => {
  // Card 1: Dynamic EQ & Harmonic Key
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [tempo, setTempo] = useState(124.8);
  const [eqLevels, setEqLevels] = useState<number[]>([
    16, 28, 22, 44, 48, 32, 58, 62, 52, 38, 46, 60, 36, 26, 46, 54, 36, 24, 20, 16
  ]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Card 2: 1 to 10 Community Consensus
  const [userVote, setUserVote] = useState<number | null>(null);
  const [consensusScore, setConsensusScore] = useState(9.6);
  const [voteCount, setVoteCount] = useState(3420);
  const [voteLoggedNotice, setVoteLoggedNotice] = useState(false);

  // Card 3: 1-Click Native Launch
  const [launchedService, setLaunchedService] = useState<string | null>(null);

  // Card 4: ISRC Catalog Sync Simulation
  const [isrcVerifying, setIsrcVerifying] = useState(false);
  const [isrcVerified, setIsrcVerified] = useState(false);

  // Smooth mouse spotlight tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  // Web Audio subtle harmonic simulation
  const toggleAudio = () => {
    const nextState = !isPlayingAudio;
    setIsPlayingAudio(nextState);

    try {
      if (nextState) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }

        const ctx = audioCtxRef.current;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.connect(ctx.destination);
        gainRef.current = gain;

        // Warm harmonic chord (F2 87.3Hz and C3 130.8Hz)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(87.31, ctx.currentTime);
        osc1.connect(gain);
        osc1.start();
        osc1Ref.current = osc1;

        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(130.81, ctx.currentTime);
        osc2.connect(gain);
        osc2.start();
        osc2Ref.current = osc2;
      } else {
        if (gainRef.current && audioCtxRef.current) {
          gainRef.current.gain.linearRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.1);
        }
        setTimeout(() => {
          try {
            osc1Ref.current?.stop();
            osc2Ref.current?.stop();
            osc1Ref.current?.disconnect();
            osc2Ref.current?.disconnect();
          } catch {
            // Ignore stop errors if already stopped
          }
        }, 120);
      }
    } catch {
      // AudioContext fallback for restricted browsers
    }
  };

  // Dynamic EQ fluctuations when playing
  useEffect(() => {
    if (!isPlayingAudio) return;
    const interval = setInterval(() => {
      setEqLevels((prev) =>
        prev.map((val) => {
          const delta = (Math.random() - 0.48) * 12;
          return Math.max(12, Math.min(62, Math.round(val + delta)));
        })
      );
    }, 180);
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      try {
        osc1Ref.current?.stop();
        osc2Ref.current?.stop();
        audioCtxRef.current?.close();
      } catch {
        // Safe cleanup
      }
    };
  }, []);

  const handleVote = (score: number) => {
    setUserVote(score);
    const newScore = parseFloat(((consensusScore * voteCount + score) / (voteCount + 1)).toFixed(1));
    setConsensusScore(newScore);
    setVoteCount((c) => c + 1);
    setVoteLoggedNotice(true);
    setTimeout(() => setVoteLoggedNotice(false), 3000);
  };

  const handleNativeLaunch = (service: string) => {
    setLaunchedService(service);
    const el = document.getElementById('converter');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => setLaunchedService(null), 3500);
  };

  const handleRunIsrcVerify = () => {
    setIsrcVerifying(true);
    setIsrcVerified(false);
    setTimeout(() => {
      setIsrcVerifying(false);
      setIsrcVerified(true);
    }, 1200);
  };

  return (
    <section id="features" className="aceternity-bento-section" aria-label="Core platform architecture">
      <div className="bento-header-group">
        <div className="bento-badge-pill">
          <span>02 / SYSTEM ARCHITECTURE</span>
        </div>
        <h2 className="bento-title">
          Engineered for acoustic precision & universal sync
        </h2>
        <p className="bento-subtitle">
          Built for audio purists and playlist curators who demand zero compromise on metadata fidelity, cross-service portability, and community transparency.
        </p>
      </div>

      <div className="bento-grid-container">
        {/* Card 1: Large Span 2 - Audio Spectrum & Harmonic Match */}
        <FollowerPointerCard
          className="bento-card span-2 bento-spectrum-card"
          onMouseMove={handleMouseMove}
          title={
            <div className="follower-bento-preview">
              <span className="follower-pill-avatar">✦</span>
              <span className="follower-curator-name">Module 01</span>
              <span className="follower-pill-sep">·</span>
              <span className="follower-pill-badge">{isPlayingAudio ? 'Audio Active' : 'Click to Simulate'}</span>
            </div>
          }
        >
          <div className="studio-crosshair top-left">+</div>
          <div className="studio-crosshair top-right">+</div>
          <div className="bento-card-spotlight" aria-hidden="true" />
          <div className="bento-card-content">
            <div className="bento-card-top-row">
              <div className="bento-icon-wrapper">
                <Waves size={18} />
              </div>
              <span className="card-index-tag">MODULE // 01</span>
            </div>

            <div className="bento-text-block">
              <h3 className="bento-card-heading">
                Lossless Dynamic EQ & Harmonic Key Matching
              </h3>
              <p className="bento-card-text">
                Every track transition is analyzed for acoustic compatibility. Inspect tempo flow, energy distribution, and key transitions across all services without losing bit depth.
              </p>
            </div>

            {/* Interactive Audio Visualizer Box */}
            <div className="bento-interactive-box">
              <div className="interactive-box-top">
                <div className="interactive-label-group">
                  <span className="box-indicator-label">32-Band Acoustic Analyzer</span>
                  <span className={`live-pulse-dot ${isPlayingAudio ? 'active' : ''}`} />
                </div>
                <button
                  type="button"
                  className={`bento-play-toggle ${isPlayingAudio ? 'active-playing' : ''}`}
                  onClick={toggleAudio}
                  aria-label={isPlayingAudio ? 'Pause analyzer' : 'Simulate 32-Band EQ'}
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause size={12} fill="currentColor" />
                      <span>Pause Analyzer</span>
                    </>
                  ) : (
                    <>
                      <Play size={12} fill="currentColor" />
                      <span>Simulate 32-Band EQ</span>
                    </>
                  )}
                </button>
              </div>

              {/* Interactive EQ Bars (Clickable) */}
              <div
                className={`bento-eq-bars ${isPlayingAudio ? 'active-bars' : ''}`}
                aria-label="Interactive EQ bars"
              >
                {eqLevels.map((val, i) => (
                  <button
                    key={i}
                    type="button"
                    className="eq-bar-item-btn"
                    onClick={() => {
                      setEqLevels((prev) => {
                        const copy = [...prev];
                        copy[i] = copy[i] > 45 ? 18 : 58;
                        return copy;
                      });
                    }}
                    title={`Band ${i + 1}: ${val}dB`}
                    aria-label={`EQ Band ${i + 1}`}
                  >
                    <span
                      className="eq-bar-item"
                      style={{
                        height: `${val}px`,
                        animationDelay: `${(i % 5) * 0.12}s`,
                      }}
                    />
                  </button>
                ))}
              </div>

              <div className="bento-metrics-row">
                <button
                  type="button"
                  className="metric-cell-btn"
                  onClick={() => setTempo((t) => (t === 124.8 ? 128.0 : t === 128.0 ? 140.0 : 124.8))}
                  title="Click to cycle BPM"
                >
                  <span className="metric-label">Average Tempo ↻</span>
                  <span className="metric-value">{tempo} BPM</span>
                </button>
                <div className="metric-cell">
                  <span className="metric-label">Dynamic Headroom</span>
                  <span className="metric-value">+14.2 LUFS</span>
                </div>
                <div className="metric-cell">
                  <span className="metric-label">Harmonic Key</span>
                  <span className="metric-value">F Minor → A♭ (99.2%)</span>
                </div>
              </div>
            </div>
          </div>
        </FollowerPointerCard>

        {/* Card 2: Span 1 - 1 to 10 Community Scoring */}
        <FollowerPointerCard
          className="bento-card span-1 bento-score-card"
          onMouseMove={handleMouseMove}
          title={
            <div className="follower-bento-preview">
              <span className="follower-pill-avatar">★</span>
              <span className="follower-curator-name">Module 02</span>
              <span className="follower-pill-sep">·</span>
              <span className="follower-pill-badge">Click to Vote</span>
            </div>
          }
        >
          <div className="studio-crosshair top-left">+</div>
          <div className="studio-crosshair top-right">+</div>
          <div className="bento-card-spotlight" aria-hidden="true" />
          <div className="bento-card-content">
            <div className="bento-card-top-row">
              <div className="bento-icon-wrapper">
                <span className="mono-icon">★</span>
              </div>
              <span className="card-index-tag">MODULE // 02</span>
            </div>

            <h3 className="bento-card-heading">
              1 to 10 Community Consensus
            </h3>
            <p className="bento-card-text">
              Zero algorithmic payola, zero sponsored promotions. Curations rise purely on listener votes.
            </p>

            <div className="bento-score-display">
              <div className="score-number-badge">
                <span className="score-huge">{consensusScore}</span>
                <span className="score-denom">/10</span>
              </div>
              <div className="score-details">
                <span className="score-curator">Verified Listeners</span>
                <span className="score-votes">{voteCount.toLocaleString()} peer reviews logged</span>
              </div>
            </div>

            {/* Interactive Voting Buttons */}
            <div className="bento-vote-selector" aria-label="Submit community score">
              <span className="vote-prompt">Log Your Score:</span>
              <div className="vote-pills-row">
                {[8.0, 9.0, 9.5, 10.0].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`bento-vote-pill ${userVote === num ? 'selected' : ''}`}
                    onClick={() => handleVote(num)}
                  >
                    <Star size={10} />
                    <span>{num.toFixed(1)}</span>
                  </button>
                ))}
              </div>
            </div>

            {voteLoggedNotice && (
              <div className="vote-confirmed-chip">
                <Check size={12} />
                <span>Vote logged: {userVote?.toFixed(1)}/10</span>
              </div>
            )}
          </div>
        </FollowerPointerCard>

        {/* Card 3: Span 1 - Direct Native App Launch */}
        <FollowerPointerCard
          className="bento-card span-1 bento-native-card"
          onMouseMove={handleMouseMove}
          title={
            <div className="follower-bento-preview">
              <span className="follower-pill-avatar">↗</span>
              <span className="follower-curator-name">Module 03</span>
              <span className="follower-pill-sep">·</span>
              <span className="follower-pill-badge">Click to Activate</span>
            </div>
          }
        >
          <div className="studio-crosshair top-left">+</div>
          <div className="studio-crosshair top-right">+</div>
          <div className="bento-card-spotlight" aria-hidden="true" />
          <div className="bento-card-content">
            <div className="bento-card-top-row">
              <div className="bento-icon-wrapper">
                <ExternalLink size={18} />
              </div>
              <span className="card-index-tag">MODULE // 03</span>
            </div>

            <h3 className="bento-card-heading">
              1-Click Native Launch
            </h3>
            <p className="bento-card-text">
              Don't stay trapped in a browser player. Deep-link directly into Spotify, Apple Music, or YouTube Music on your device.
            </p>

            <div className="native-app-buttons-preview">
              <button
                type="button"
                className="native-app-pill-btn"
                onClick={() => handleNativeLaunch('Spotify')}
              >
                <span className="app-dot dot-spotify" />
                <span>Spotify Desktop / Mobile</span>
                <span className="pill-arrow">→</span>
              </button>
              <button
                type="button"
                className="native-app-pill-btn"
                onClick={() => handleNativeLaunch('Apple Music')}
              >
                <span className="app-dot dot-apple" />
                <span>Apple Music Native App</span>
                <span className="pill-arrow">→</span>
              </button>
              <button
                type="button"
                className="native-app-pill-btn"
                onClick={() => handleNativeLaunch('YouTube Music')}
              >
                <span className="app-dot dot-youtube" />
                <span>YouTube Music Direct</span>
                <span className="pill-arrow">→</span>
              </button>
            </div>

            {launchedService && (
              <div className="launch-notice-chip">
                <span>Selected {launchedService} in converter</span>
              </div>
            )}
          </div>
        </FollowerPointerCard>

        {/* Card 4: Span 2 - ISRC Cross-Platform Resolution */}
        <FollowerPointerCard
          className="bento-card span-2 bento-isrc-card"
          onMouseMove={handleMouseMove}
          title={
            <div className="follower-bento-preview">
              <span className="follower-pill-avatar">⇄</span>
              <span className="follower-curator-name">Module 04</span>
              <span className="follower-pill-sep">·</span>
              <span className="follower-pill-badge">Click to Verify</span>
            </div>
          }
        >
          <div className="studio-crosshair top-left">+</div>
          <div className="studio-crosshair top-right">+</div>
          <div className="bento-card-spotlight" aria-hidden="true" />
          <div className="bento-card-content">
            <div className="bento-card-top-row">
              <div className="bento-icon-wrapper">
                <CheckCircle2 size={18} />
              </div>
              <span className="card-index-tag">MODULE // 04</span>
            </div>

            <div className="bento-text-block">
              <h3 className="bento-card-heading">
                Lossless ISRC Metadata Catalog Sync
              </h3>
              <p className="bento-card-text">
                Tracks are resolved using international standard recording codes (ISRC), acoustic fingerprinting, and artist metadata to guarantee exact version matching.
              </p>
            </div>

            <div className="isrc-sync-simulation">
              <div className="isrc-stat-chip">
                <span className="chip-badge">Catalog Fidelity: 99.8% Match</span>
                <button
                  type="button"
                  className={`isrc-verify-btn ${isrcVerifying ? 'verifying' : ''}`}
                  onClick={handleRunIsrcVerify}
                  disabled={isrcVerifying}
                >
                  {isrcVerifying ? (
                    <span>Auditing ISRC...</span>
                  ) : isrcVerified ? (
                    <span className="verified-text">✓ 100% Bit-Perfect</span>
                  ) : (
                    <span>Run Live ISRC Audit</span>
                  )}
                </button>
              </div>

              <div className="isrc-platforms-row">
                <span className="platform-tag">Spotify</span>
                <span className="platform-arrow">⇄</span>
                <span className="platform-tag">Apple Music</span>
                <span className="platform-arrow">⇄</span>
                <span className="platform-tag">YouTube Music</span>
                <span className="platform-arrow">⇄</span>
                <span className="platform-tag">TIDAL</span>
              </div>

              {isrcVerified && (
                <div className="isrc-audit-details">
                  <span>Match Hash: US-AT2-24-00192 · Bit-depth: 24-bit 96kHz Lossless</span>
                </div>
              )}
            </div>
          </div>
        </FollowerPointerCard>
      </div>
    </section>
  );
};

export default BentoGrid;
