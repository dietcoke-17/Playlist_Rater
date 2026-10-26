import { useState } from 'react';
import { useInView } from '../hooks/useAnimations';
import './FaqSection.css';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FaqItem[] = [
  {
    id: 'faq-0',
    question: 'How does cross platform playlist recreation work if I do not have the creator music app?',
    answer: 'If someone shares a Spotify playlist but you listen on Apple Music or YouTube Music, PlaylistIQ matches the track titles, artist names, and audio metadata against your target service catalogue. You can save and recreate the exact playlist in your personal music app in seconds with over 98% track accuracy.',
    category: 'Conversion',
  },
  {
    id: 'faq-1',
    question: 'Which music apps and streaming platforms are currently supported?',
    answer: 'PlaylistIQ connects with Spotify, Apple Music, YouTube Music, TIDAL, Amazon Music, and SoundCloud. You can paste public playlist links from any of these services or link your personal accounts to manage your entire curation in one place.',
    category: 'Compatibility',
  },
  {
    id: 'faq-2',
    question: 'Can I open any playlist directly inside my native music application?',
    answer: 'Yes. Every playlist on PlaylistIQ includes direct deep links that launch the collection inside your installed desktop or mobile app with one click, so you never lose your native listening experience.',
    category: 'Playback',
  },
  {
    id: 'faq-3',
    question: 'How do community ratings work and how is review manipulation prevented?',
    answer: 'Our scoring engine uses weighted community consensus on a pure 1 to 10 scale. Ratings from listeners with verified playback history carry higher weight, and sudden vote bursts from unverified accounts are automatically filtered out from the global charts.',
    category: 'Scoring',
  },
  {
    id: 'faq-4',
    question: 'Will linking my streaming accounts alter or delete my existing playlists?',
    answer: 'Never. PlaylistIQ requests standard read access to import your public track titles, playlist names, and cover art. We never delete tracks, alter your saved library, or modify your streaming account without explicit permission.',
    category: 'Security',
  },
  {
    id: 'faq-5',
    question: 'Is PlaylistIQ free or is a paid subscription required?',
    answer: 'PlaylistIQ is completely free. You can convert playlist links, browse the top 250 leaderboards, launch native music apps, and rate curations without ever entering payment details or signing up for a trial.',
    category: 'Pricing',
  },
];

export default function FaqSection() {
  const { ref, isInView } = useInView();
  const [openId, setOpenId] = useState<string | null>('faq-0');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="faq-section" ref={ref} aria-label="Frequently asked questions">
      <div className="faq-container">
        {/* Header */}
        <div className="faq-header">
          <div className="pill-badge pill-badge--dark">
            <span className="badge-dot dot-violet" aria-hidden="true" /> Clear answers
          </div>
          <h2 className={`faq-title ${isInView ? 'revealed' : ''}`}>
            Frequently asked questions
          </h2>
          <p className="faq-subtitle">
            Everything you need to know about cross platform conversion, native app playback, and community scores.
          </p>
        </div>

        {/* Accordion */}
        <div className="faq-accordion" role="region" aria-label="FAQ questions list">
          {faqData.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`faq-card ${isOpen ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  id={`faq-btn-${item.id}`}
                >
                  <span className="faq-category-tag">{item.category}</span>
                  <span className="faq-question-text">{item.question}</span>
                  <span className="faq-toggle-icon" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-btn-${item.id}`}
                    className="faq-answer-panel"
                  >
                    <p className="faq-answer-text">{item.answer}</p>
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
