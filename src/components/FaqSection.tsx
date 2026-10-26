import { useState } from 'react';
import { useInView } from '../hooks/useAnimations';
import './FaqSection.css';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  badgeColor: 'violet' | 'green' | 'red' | 'yellow' | 'blue' | 'teal';
}

const faqData: FaqItem[] = [
  {
    id: 'faq-0',
    question: 'Is this different from Spotify\'s own recommendations?',
    answer: 'Yes. Spotify\'s algorithm is built to keep you inside Spotify\'s catalogue. PlaylistIQ is ranked by real listeners with no commercial incentive — the top playlist is there because thousands of people rated it above 9.0, not because a label paid for placement.',
    badgeColor: 'teal',
  },
  {
    id: 'faq-1',
    question: 'How does PlaylistIQ score and rank playlists?',
    answer: 'The algorithm combines community ratings (1 to 10 stars), track cohesion metrics, playback repeat frequency, and verified curator reviews to deliver an unbiased 9.0+ Hall of Fame score.',
    badgeColor: 'violet',
  },
  {
    id: 'faq-2',
    question: 'Can I connect Spotify, Apple Music, or YouTube Music?',
    answer: 'Yes. Connect your favourite streaming provider with one click to instantly import your playlists, share ratings, and sync listening activity across devices.',
    badgeColor: 'green',
  },
  {
    id: 'faq-3',
    question: 'What are Navigators and Curator Badges?',
    answer: 'Navigators are top playlist creators in the community. As your submitted playlists gain community votes, you earn coloured spatial badges (Violet, Green, Red, Yellow, Blue) and unlock rewards.',
    badgeColor: 'red',
  },
  {
    id: 'faq-4',
    question: 'Is PlaylistIQ completely free to use?',
    answer: '100% free. Anyone can browse, rate, and discover playlists. Verified curators can also access advanced analytics on playlist retention and listener engagement.',
    badgeColor: 'yellow',
  },
  {
    id: 'faq-5',
    question: 'How do the spatial web SVG transitions work?',
    answer: 'The spatial visual engine uses GPU-accelerated SVG chevrons and CSS view-timelines to transform colours and sections dynamically as you scroll.',
    badgeColor: 'blue',
  },
];

export default function FaqSection() {
  const { ref, isInView } = useInView();
  const [openId, setOpenId] = useState<string | null>('faq-0');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="section section--faq" ref={ref}>
      <div className="section-inner">
        <div className="faq-badge">
          <span>❓ Help &amp; Knowledge</span> FAQ
        </div>

        <h2 className={`section-headline ${isInView ? 'revealed' : ''}`}>
          Frequently asked <span className="headline-highlight">questions</span>
        </h2>
        <p className="section-sub">
          Everything you need to know about rating, curating, and discovering playlists.
        </p>

        <div className={`faq-accordion ${isInView ? 'revealed' : ''}`}>
          {faqData.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`faq-card faq-card--${item.badgeColor} ${isOpen ? 'open' : ''}`}
                onClick={() => toggleFaq(item.id)}
              >
                <button
                  className="faq-question-btn"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <span className={`faq-color-indicator indicator--${item.badgeColor}`} />
                  <span className="faq-question-text">{item.question}</span>
                  <span className="faq-icon" aria-hidden="true">
                    {isOpen ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div id={`faq-answer-${item.id}`} className="faq-answer-content">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
