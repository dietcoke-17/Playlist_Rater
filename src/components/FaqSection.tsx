import { useState } from 'react';
import { useInView } from '../hooks/useAnimations';
import './FaqSection.css';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  badgeColor: 'violet' | 'green' | 'red' | 'yellow' | 'blue';
}

const faqData: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How does Playlist Rater score and rank playlists?',
    answer: 'Our algorithm combines community ratings (1–10 stars), track cohesion metrics, playback repeat frequency, and verified curator reviews to deliver an unbiased 9.0+ Hall of Fame score.',
    badgeColor: 'violet',
  },
  {
    id: 'faq-2',
    question: 'Can I connect Spotify, Apple Music, or YouTube Music?',
    answer: 'Yes! Connect your favorite streaming provider with one click to instantly import your playlists, share ratings, and sync listening activity across devices.',
    badgeColor: 'green',
  },
  {
    id: 'faq-3',
    question: 'What are Navigators and Curator Badges?',
    answer: 'Navigators are community acceptors and top playlist creators. As your submitted playlists gain community votes, you earn colored spatial badges (Violet, Green, Red, Yellow, Blue) and unlock rewards.',
    badgeColor: 'red',
  },
  {
    id: 'faq-4',
    question: 'Is Playlist Rater completely free to use?',
    answer: '100% free! Anyone can browse, rate, and discover playlists. Verified curators can also access advanced analytics on playlist retention and listener engagement.',
    badgeColor: 'yellow',
  },
  {
    id: 'faq-5',
    question: 'How do the spatial web SVG transitions work?',
    answer: 'Our spatial visual engine uses GPU-accelerated SVG chevrons and CSS view-timelines to transform colors and sections dynamically as you scroll.',
    badgeColor: 'blue',
  },
];

export default function FaqSection() {
  const { ref, isInView } = useInView();
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="section section--faq" ref={ref}>
      <div className="section-inner">
        <div className="faq-badge">
          <span>❓ Help & Knowledge</span> FAQ
        </div>

        <h2 className={`section-headline ${isInView ? 'revealed' : ''}`}>
          Frequently Asked <span className="headline-highlight">Questions</span>
        </h2>
        <p className="section-sub">
          Everything you need to know about rating, curating, and sharing spatial web playlists.
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
                  <span className="faq-icon">{isOpen ? '−' : '+'}</span>
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
