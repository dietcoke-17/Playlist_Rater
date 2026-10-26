import { useState } from 'react';
import { useInView } from '../hooks/useAnimations';
import { Play, Pause, Waves, Sparkle } from '@phosphor-icons/react';
import './BenefitsSection.css';

// Seeded activity levels for 16 weeks x 7 days = 112 cells (Timmo style contribution heatmap)
const heatmapData = [
  // W1-W4
  [1, 2, 0, 3, 2, 4, 1],
  [2, 3, 1, 2, 4, 3, 2],
  [0, 1, 2, 3, 3, 2, 1],
  [1, 2, 4, 2, 3, 4, 3],
  // W5-W8
  [2, 3, 3, 4, 2, 3, 2],
  [1, 2, 1, 2, 3, 4, 4],
  [3, 4, 2, 3, 4, 3, 2],
  [2, 3, 4, 3, 2, 4, 3],
  // W9-W12
  [3, 2, 3, 4, 4, 3, 1],
  [2, 4, 3, 3, 2, 4, 4],
  [4, 3, 2, 4, 3, 2, 3],
  [3, 4, 4, 2, 3, 4, 4],
  // W13-W16
  [2, 3, 4, 4, 3, 4, 3],
  [3, 4, 3, 2, 4, 3, 4],
  [4, 4, 3, 4, 4, 4, 3],
  [3, 4, 4, 4, 3, 4, 4],
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function BenefitsSection() {
  const { ref, isInView } = useInView();
  const [activeScoreTab, setActiveScoreTab] = useState<'community' | 'algorithm' | 'heatmap'>('community');
  const [hoveredCell, setHoveredCell] = useState<{ week: number; day: string; level: number } | null>(null);
  const [audioSimulationPlaying, setAudioSimulationPlaying] = useState(false);

  return (
    <section id="features" className="benefits-section" ref={ref} aria-label="Product benefits">
      <div className="benefits-container">
        {/* Eyebrow and Headline */}
        <div className="benefits-header">
          <div className="pill-badge pill-badge--dark">
            <span className="badge-dot dot-violet" aria-hidden="true" />
            <span>Real outcomes</span>
          </div>
          <h2 className={`benefits-title ${isInView ? 'revealed' : ''}`}>
            Built for listeners who care about great curation
          </h2>
          <p className="benefits-subtitle">
            Streaming platforms keep you locked in walled gardens and push sponsored algorithms.
            Playlitfy connects all music players at one endpoint and rewards genuine track flow.
          </p>
        </div>

        {/* Asymmetrical Benefits Layout */}
        <div className="benefits-showcase">
          {/* 1. Hero Benefit Split Card: Community Consensus vs Algorithmic Churn vs Heatmap */}
          <div className="benefit-hero-card">
            <div className="benefit-hero-content">
              <span className="benefit-number">01</span>
              <h3 className="benefit-hero-title">
                Unbiased community scores replace sponsored recommendations
              </h3>
              <p className="benefit-hero-desc">
                Every rating comes from an authentic listener vote between 1 and 10. No payola,
                no label placement, and no manufactured trending tracks. If a playlist ranks high,
                thousands of music fans verified its flow.
              </p>
              <div className="benefit-meta-tags">
                <span className="benefit-tag">1 to 10 score scale</span>
                <span className="benefit-tag">Verified listener reviews</span>
                <span className="benefit-tag">Zero commercial placement</span>
              </div>
            </div>

            {/* Interactive Score & Heatmap Comparison Card (Timmo style) */}
            <div className="benefit-hero-widget" aria-label="Rating comparison and activity widget">
              <div className="widget-tab-buttons" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeScoreTab === 'community'}
                  className={`widget-tab ${activeScoreTab === 'community' ? 'active' : ''}`}
                  onClick={() => setActiveScoreTab('community')}
                >
                  Community score
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeScoreTab === 'algorithm'}
                  className={`widget-tab ${activeScoreTab === 'algorithm' ? 'active' : ''}`}
                  onClick={() => setActiveScoreTab('algorithm')}
                >
                  Streaming algorithm
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeScoreTab === 'heatmap'}
                  className={`widget-tab ${activeScoreTab === 'heatmap' ? 'active' : ''}`}
                  onClick={() => setActiveScoreTab('heatmap')}
                >
                  Curator heatmap
                </button>
              </div>

              {activeScoreTab === 'community' && (
                <div className="widget-card-panel">
                  <div className="widget-score-header">
                    <div className="widget-rating-badge">9.4</div>
                    <div className="widget-rating-info">
                      <span className="widget-rating-label">Community score</span>
                      <span className="widget-rating-votes">Based on 1,480 listener votes</span>
                    </div>
                  </div>
                  <div className="metric-bars">
                    <div className="metric-row">
                      <span className="metric-name">Track transition flow</span>
                      <div className="metric-track" aria-hidden="true">
                        <div className="metric-fill" style={{ width: '96%', background: '#3EC96A' }} />
                      </div>
                      <span className="metric-value">9.6</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-name">Curation originality</span>
                      <div className="metric-track" aria-hidden="true">
                        <div className="metric-fill" style={{ width: '92%', background: '#7B61FF' }} />
                      </div>
                      <span className="metric-value">9.2</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-name">Repeat listen frequency</span>
                      <div className="metric-track" aria-hidden="true">
                        <div className="metric-fill" style={{ width: '94%', background: '#FFB830' }} />
                      </div>
                      <span className="metric-value">9.4</span>
                    </div>
                  </div>
                </div>
              )}

              {activeScoreTab === 'algorithm' && (
                <div className="widget-card-panel">
                  <div className="widget-score-header">
                    <div className="widget-rating-badge widget-rating-badge--dim">5.8</div>
                    <div className="widget-rating-info">
                      <span className="widget-rating-label">Algorithmic shuffle</span>
                      <span className="widget-rating-votes">Commercial catalog priority</span>
                    </div>
                  </div>
                  <div className="metric-bars">
                    <div className="metric-row">
                      <span className="metric-name">Repetitive top 40 tracks</span>
                      <div className="metric-track" aria-hidden="true">
                        <div className="metric-fill" style={{ width: '88%', background: '#FF5733' }} />
                      </div>
                      <span className="metric-value">8.8</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-name">Sponsored label push</span>
                      <div className="metric-track" aria-hidden="true">
                        <div className="metric-fill" style={{ width: '82%', background: '#FF5733' }} />
                      </div>
                      <span className="metric-value">8.2</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-name">Listener curation voice</span>
                      <div className="metric-track" aria-hidden="true">
                        <div className="metric-fill" style={{ width: '24%', background: '#888888' }} />
                      </div>
                      <span className="metric-value">2.4</span>
                    </div>
                  </div>
                </div>
              )}

              {activeScoreTab === 'heatmap' && (
                <div className="widget-card-panel heatmap-panel">
                  <div className="heatmap-header">
                    <span className="heatmap-title">Live curation activity</span>
                    <span className="heatmap-sub">16 weeks · 112 community audit days</span>
                  </div>

                  <div className="curator-heatmap-grid" aria-label="Curator daily activity calendar">
                    {heatmapData.map((week, wIdx) => (
                      <div key={wIdx} className="heatmap-week-col">
                        {week.map((level, dIdx) => (
                          <div
                            key={dIdx}
                            className={`heatmap-cell heat-level-${level}`}
                            onMouseEnter={() =>
                              setHoveredCell({
                                week: wIdx + 1,
                                day: DAYS[dIdx],
                                level,
                              })
                            }
                            onMouseLeave={() => setHoveredCell(null)}
                            title={`Week ${wIdx + 1}, ${DAYS[dIdx]}: ${level * 24 + 18} votes cast`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="heatmap-footer">
                    <div className="heatmap-inspector">
                      {hoveredCell ? (
                        <span className="inspector-active">
                          Week {hoveredCell.week}, {hoveredCell.day} · {hoveredCell.level * 24 + 18} votes cast · 9.4 avg score
                        </span>
                      ) : (
                        <span className="inspector-hint">
                          4,920 votes logged this week · 99.4% catalog accuracy
                        </span>
                      )}
                    </div>
                    <div className="heatmap-legend" aria-hidden="true">
                      <span>Less</span>
                      <span className="legend-box heat-level-0" />
                      <span className="legend-box heat-level-1" />
                      <span className="legend-box heat-level-2" />
                      <span className="legend-box heat-level-3" />
                      <span className="legend-box heat-level-4" />
                      <span>More</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3 Outcome Complementary Grid Cards */}
          <div className="benefits-trio">
            {/* Benefit 2: Universal Cross Platform Sync and Recreation */}
            <div className="benefit-card">
              <div className="benefit-card-top">
                <span className="benefit-card-number">02</span>
                <div className="benefit-icon-badge" style={{ background: '#7B61FF1A', color: '#7B61FF' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M21 12a9 9 0 00-9-9 9.75 9.75 0 00-6.74 2.74L3 8M3 3v5h5M3 12a9 9 0 009 9 9.75 9.75 0 006.74-2.74L21 16M21 21v-5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h3 className="benefit-card-title">One stop solution across all music players</h3>
              <p className="benefit-card-desc">
                Never get locked out because you use Apple Music and your friend uses Spotify.
                Open playlists in your native app or recreate them in your personal library with one click.
              </p>
              <div className="benefit-visual-snippet snippet-sync">
                <span className="sync-pulse" aria-hidden="true" />
                <span className="sync-text">98.4% match rate · Spotify, Apple, YouTube, TIDAL</span>
              </div>
            </div>

            {/* Benefit 3: Audio Metrics with interactive sonic visualizer */}
            <div className="benefit-card">
              <div className="benefit-card-top">
                <span className="benefit-card-number">03</span>
                <div className="benefit-icon-badge" style={{ background: '#3EC96A1A', color: '#3EC96A' }}>
                  <Waves size={20} weight="bold" />
                </div>
              </div>
              <h3 className="benefit-card-title">Inspect real audio metrics before listening</h3>
              <p className="benefit-card-desc">
                Know the sonic blueprint of any collection. Inspect average tempo, dynamic energy distribution, key coherence, and danceability at a glance.
              </p>

              {/* Interactive Sonic Spectrum Visualizer (Timmo & Mascofast style) */}
              <div className="sonic-visualizer-container">
                <div className="sonic-header-row">
                  <span className="sonic-blueprint-title">Live sonic blueprint</span>
                  <button
                    type="button"
                    className="sonic-play-btn"
                    onClick={() => setAudioSimulationPlaying(!audioSimulationPlaying)}
                    aria-label={audioSimulationPlaying ? 'Pause sonic simulation' : 'Play sonic simulation'}
                  >
                    {audioSimulationPlaying ? (
                      <>
                        <Pause size={12} weight="fill" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play size={12} weight="fill" />
                        <span>Simulate EQ</span>
                      </>
                    )}
                  </button>
                </div>

                <div className={`sonic-frequency-bars ${audioSimulationPlaying ? 'playing' : ''}`} aria-hidden="true">
                  {[14, 22, 18, 28, 36, 42, 38, 48, 52, 44, 38, 46, 50, 42, 34, 28, 22, 18, 14, 10].map((h, i) => (
                    <span
                      key={i}
                      className="freq-bar"
                      style={{
                        height: `${audioSimulationPlaying ? (h * 1.2 > 56 ? 56 : h * 1.2) : h}px`,
                        animationDelay: `${(i % 5) * 0.15}s`,
                      }}
                    />
                  ))}
                </div>

                <div className="snippet-stat-grid">
                  <div className="snippet-stat">
                    <span className="stat-label">Average tempo</span>
                    <span className="stat-val">124 BPM</span>
                  </div>
                  <div className="snippet-stat">
                    <span className="stat-label">Energy level</span>
                    <span className="stat-val">78%</span>
                  </div>
                  <div className="snippet-stat">
                    <span className="stat-label">Harmonic key</span>
                    <span className="stat-val">F minor</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefit 4: Hall of Fame */}
            <div className="benefit-card">
              <div className="benefit-card-top">
                <span className="benefit-card-number">04</span>
                <div className="benefit-icon-badge" style={{ background: '#FFB8301A', color: '#FFB830' }}>
                  <Sparkle size={20} weight="fill" />
                </div>
              </div>
              <h3 className="benefit-card-title">Earn permanent recognition in the Hall of Fame</h3>
              <p className="benefit-card-desc">
                Curators who maintain an average score above 9.0 enter the global leaderboard.
                Build your independent following as the platform userbase expands worldwide.
              </p>
              <div className="benefit-visual-snippet snippet-badge">
                <div className="curator-rank-pill">
                  <span className="rank-star">★</span>
                  <span>9.0+ Hall of Fame Curator</span>
                </div>
                <span className="curator-verified-tag">✓ Verified ranking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
