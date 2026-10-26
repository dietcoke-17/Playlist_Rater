import { useState } from 'react';
import { useInView } from '../hooks/useAnimations';
import './BenefitsSection.css';

export default function BenefitsSection() {
  const { ref, isInView } = useInView();
  const [activeScoreTab, setActiveScoreTab] = useState<'community' | 'algorithm'>('community');

  return (
    <section id="features" className="benefits-section" ref={ref} aria-label="Product benefits">
      <div className="benefits-container">
        {/* Eyebrow and Headline */}
        <div className="benefits-header">
          <div className="pill-badge pill-badge--dark">
            <span className="badge-dot dot-violet" aria-hidden="true" /> Real outcomes
          </div>
          <h2 className={`benefits-title ${isInView ? 'revealed' : ''}`}>
            Built for listeners who care about great curation
          </h2>
          <p className="benefits-subtitle">
            Streaming platforms recommend tracks to satisfy commercial deals. PlaylistIQ rewards track sequencing, sonic harmony, and community taste.
          </p>
        </div>

        {/* Asymmetrical Benefits Layout */}
        <div className="benefits-showcase">
          {/* 1. Hero Benefit Split Card: Community Consensus vs Algorithmic Churn */}
          <div className="benefit-hero-card">
            <div className="benefit-hero-content">
              <span className="benefit-number">01</span>
              <h3 className="benefit-hero-title">
                Unbiased community scores replace sponsored recommendations
              </h3>
              <p className="benefit-hero-desc">
                Every rating comes from an authentic listener vote between 1 and 10. No payola, no label placement, and no manufactured trending tracks. If a playlist ranks high, thousands of music fans verified its flow.
              </p>
              <div className="benefit-meta-tags">
                <span className="benefit-tag">1 to 10 score scale</span>
                <span className="benefit-tag">Verified listener reviews</span>
                <span className="benefit-tag">Zero commercial placement</span>
              </div>
            </div>

            {/* Interactive Score Comparison Card */}
            <div className="benefit-hero-widget" aria-label="Rating comparison widget">
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
              </div>

              {activeScoreTab === 'community' ? (
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
              ) : (
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
            </div>
          </div>

          {/* 3 Outcome Complementary Grid Cards */}
          <div className="benefits-trio">
            {/* Benefit 2: Audio Metrics */}
            <div className="benefit-card">
              <div className="benefit-card-top">
                <span className="benefit-card-number">02</span>
                <div className="benefit-icon-badge" style={{ background: '#3EC96A1A', color: '#3EC96A' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 18v-4M8 18v-8M12 18V6M16 18v-6M20 18v-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <h3 className="benefit-card-title">Inspect real audio metrics before listening</h3>
              <p className="benefit-card-desc">
                Know the sonic blueprint of any collection. Inspect average tempo, dynamic energy distribution, key coherence, and danceability at a glance.
              </p>
              <div className="benefit-visual-snippet snippet-metrics">
                <div className="snippet-stat">
                  <span className="stat-label">Average tempo</span>
                  <span className="stat-val">124 BPM</span>
                </div>
                <div className="snippet-stat">
                  <span className="stat-label">Energy level</span>
                  <span className="stat-val">78%</span>
                </div>
                <div className="snippet-stat">
                  <span className="stat-label">Valence</span>
                  <span className="stat-val">Harmonic</span>
                </div>
              </div>
            </div>

            {/* Benefit 3: Hall of Fame */}
            <div className="benefit-card">
              <div className="benefit-card-top">
                <span className="benefit-card-number">03</span>
                <div className="benefit-icon-badge" style={{ background: '#FFB8301A', color: '#FFB830' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h2M18 18h2a2 2 0 002-2v-5a2 2 0 00-2-2h-2M6 9h12v9a6 6 0 01-12 0V9zM10 22h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h3 className="benefit-card-title">Earn permanent recognition in the Hall of Fame</h3>
              <p className="benefit-card-desc">
                Curators who maintain an average score above 9.0 enter the global leaderboard. Earn verified badges that travel with your profile.
              </p>
              <div className="benefit-visual-snippet snippet-badge">
                <div className="curator-rank-pill">
                  <span className="rank-star">★</span>
                  <span>9.0+ Hall of Fame Curator</span>
                </div>
                <span className="curator-verified-tag">✓ Verified ranking</span>
              </div>
            </div>

            {/* Benefit 4: Instant Spotify Sync */}
            <div className="benefit-card">
              <div className="benefit-card-top">
                <span className="benefit-card-number">04</span>
                <div className="benefit-icon-badge" style={{ background: '#7B61FF1A', color: '#7B61FF' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M21 12a9 9 0 00-9-9 9.75 9.75 0 00-6.74 2.74L3 8M3 3v5h5M3 12a9 9 0 009 9 9.75 9.75 0 006.74-2.74L21 16M21 21v-5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h3 className="benefit-card-title">Instant synchronization with your Spotify library</h3>
              <p className="benefit-card-desc">
                Connect your account in one tap. Your public playlists import in seconds, and track additions on Spotify update automatically on PlaylistIQ.
              </p>
              <div className="benefit-visual-snippet snippet-sync">
                <span className="sync-pulse" aria-hidden="true" />
                <span className="sync-text">Auto sync enabled · Zero upload required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
