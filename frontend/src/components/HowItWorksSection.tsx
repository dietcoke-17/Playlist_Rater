import { useState } from 'react';
import { useInView } from '../hooks/useAnimations';
import './HowItWorksSection.css';

interface Step {
  step: string;
  badge: string;
  title: string;
  description: string;
  accent: string;
  visualType: 'connect' | 'rate' | 'discover';
}

const steps: Step[] = [
  {
    step: '01',
    badge: 'Step one',
    title: 'Connect your library in one click',
    description: 'Link your Spotify account securely. Your public and saved playlists import automatically within seconds without manual uploads.',
    accent: '#3EC96A',
    visualType: 'connect',
  },
  {
    step: '02',
    badge: 'Step two',
    title: 'Rate playlists on a 1 to 10 scale',
    description: 'Score curation quality, tempo consistency, and track progression. Your votes feed the live charts and help genuine curation rise.',
    accent: '#7B61FF',
    visualType: 'rate',
  },
  {
    step: '03',
    badge: 'Step three',
    title: 'Explore the leaderboard and climb the charts',
    description: 'Browse the top 250 playlists by genre and mood. Maintain an average above 9.0 to earn verified curator badges on your profile.',
    accent: '#FFB830',
    visualType: 'discover',
  },
];

export default function HowItWorksSection() {
  const { ref, isInView } = useInView();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="how-it-works-section" ref={ref} aria-label="How PlaylistIQ works">
      <div className="hiw-container">
        {/* Header */}
        <div className="hiw-header">
          <div className="pill-badge pill-badge--dark">
            <span className="badge-dot dot-green" aria-hidden="true" /> Three step process
          </div>
          <h2 className={`hiw-title ${isInView ? 'revealed' : ''}`}>
            How PlaylistIQ works
          </h2>
          <p className="hiw-subtitle">
            From library connection to community leaderboard in under two minutes.
          </p>
        </div>

        {/* 3 Step Timeline Container */}
        <div className="hiw-timeline-wrapper">
          <div className="hiw-steps-row" role="list">
            {steps.map((item, index) => {
              const isSelected = activeStep === index;
              return (
                <div
                  key={item.step}
                  role="listitem"
                  className={`hiw-step-card ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveStep(index)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveStep(index);
                    }
                  }}
                  aria-label={`${item.badge}: ${item.title}`}
                >
                  <div className="step-card-header">
                    <span className="step-badge" style={{ color: item.accent, borderColor: `${item.accent}40` }}>
                      {item.badge}
                    </span>
                    <span className="step-number-watermark" aria-hidden="true">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="step-title">{item.title}</h3>
                  <p className="step-desc">{item.description}</p>

                  {/* Contextual Visual Card Snippet */}
                  <div className="step-preview-box">
                    {item.visualType === 'connect' && (
                      <div className="preview-connect">
                        <div className="connect-provider-badge">
                          <span className="connect-dot" aria-hidden="true" />
                          <span>Spotify library synced</span>
                        </div>
                        <span className="connect-count">24 playlists ready to rate</span>
                      </div>
                    )}

                    {item.visualType === 'rate' && (
                      <div className="preview-rate">
                        <div className="rate-scale-row">
                          {[7, 8, 9, 10].map((num) => (
                            <span
                              key={num}
                              className={`rate-num-pill ${num === 9 ? 'highlight' : ''}`}
                            >
                              {num === 9 ? '9.4 ★' : `${num}.0`}
                            </span>
                          ))}
                        </div>
                        <span className="rate-caption">Curation harmony: 9.4/10</span>
                      </div>
                    )}

                    {item.visualType === 'discover' && (
                      <div className="preview-discover">
                        <div className="discover-rank-pill">
                          <span className="trophy-icon">🏆</span>
                          <span>#3 Global Synthwave Chart</span>
                        </div>
                        <span className="discover-badge-text">Gold Curator Status Active</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
