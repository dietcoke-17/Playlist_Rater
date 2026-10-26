import { useState } from 'react';
import { useInView } from '../hooks/useAnimations';
import './HowItWorksSection.css';

interface Step {
  step: string;
  badge: string;
  title: string;
  description: string;
  accent: string;
  visualType: 'connect' | 'convert' | 'rate';
}

const steps: Step[] = [
  {
    step: '01',
    badge: 'Step one',
    title: 'Paste any link or connect your library',
    description: 'Enter a public playlist URL from Spotify, Apple Music, or YouTube Music, or link your authorized account to load your entire library in seconds without manual uploads.',
    accent: '#3EC96A',
    visualType: 'connect',
  },
  {
    step: '02',
    badge: 'Step two',
    title: 'Open in native player or convert across apps',
    description: 'Click to listen directly in the original music app, or recreate and save the entire playlist in your personal service with over 98% catalogue match accuracy.',
    accent: '#7B61FF',
    visualType: 'convert',
  },
  {
    step: '03',
    badge: 'Step three',
    title: 'Rate on a 1 to 10 scale and grow your audience',
    description: 'Score track flow and curation originality. Your votes shape the global charts, and top curators earn Hall of Fame badges as our community expands.',
    accent: '#FFB830',
    visualType: 'rate',
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
            From pasting any playlist URL to cross platform playback and community charts in two minutes.
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
                          <span>Spotify · Apple · YouTube linked</span>
                        </div>
                        <span className="connect-count">Ready to import or paste</span>
                      </div>
                    )}

                    {item.visualType === 'convert' && (
                      <div className="preview-rate">
                        <div className="rate-stars-row">
                          <span className="sync-pulse-mini" />
                          <span className="rating-pill-display">Spotify → Apple Music</span>
                        </div>
                        <span className="rate-feedback-text">52 of 52 tracks matched (100%)</span>
                      </div>
                    )}

                    {item.visualType === 'rate' && (
                      <div className="preview-discover">
                        <div className="discover-rank-pill">
                          <span className="discover-star">★ 9.4</span>
                          <span>Hall of Fame Curator</span>
                        </div>
                        <span className="discover-chart-pos">Rank 01 in Global Charts</span>
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
