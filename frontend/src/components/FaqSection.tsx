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
    question: 'How is PlaylistIQ different from Spotify recommendations?',
    answer: 'Spotify optimizes recommendations to maximize platform listening time and fulfill commercial catalogue arrangements. PlaylistIQ is independent and community driven. The top playlists rank high because thousands of verified listeners gave them 9.0 or higher scores, not because an advertising deal paid for placement.',
    category: 'Ranking',
  },
  {
    id: 'faq-1',
    question: 'Is PlaylistIQ free, or is there a credit card required?',
    answer: 'PlaylistIQ is completely free. You can browse the top 250 leaderboards, submit ratings, and sync your curated playlists without ever entering payment details or signing up for a trial.',
    category: 'Pricing',
  },
  {
    id: 'faq-2',
    question: 'How do you prevent review manipulation and fake ratings?',
    answer: 'Our scoring engine uses weighted community consensus. Ratings from listeners with verified playback history carry higher trust, and sudden vote bursts from unverified accounts are flagged and excluded from the leaderboard calculation.',
    category: 'Security',
  },
  {
    id: 'faq-3',
    question: 'Will connecting Spotify modify or overwrite my playlists?',
    answer: 'Never. PlaylistIQ requests standard read access to import your public playlist names, track titles, and cover art. We never alter your Spotify account, add tracks without permission, or modify your saved library.',
    category: 'Library',
  },
  {
    id: 'faq-4',
    question: 'What qualifies a playlist for the 9.0 and above Hall of Fame?',
    answer: 'To enter the Hall of Fame, a playlist must accumulate at least 250 unique listener ratings and maintain an overall score of 9.0 or higher across track transitions, curation originality, and repeat listen frequency.',
    category: 'Curators',
  },
  {
    id: 'faq-5',
    question: 'Can independent curators build a following on the platform?',
    answer: 'Yes. Every curator receives a dedicated profile displaying their overall score average, Hall of Fame placements, and earned badges. Listeners can follow your profile to get notified whenever you publish a new collection.',
    category: 'Community',
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
            Everything you need to know about community ratings, library sync, and curator rankings.
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
