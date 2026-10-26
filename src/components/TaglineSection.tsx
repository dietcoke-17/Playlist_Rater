import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './TaglineSection.css';

gsap.registerPlugin(ScrollTrigger);

const TAGLINE_LINES = [
  'Music curation is an art form.',
  'It belongs to human listeners,',
  'not advertising algorithms.',
];

export default function TaglineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const textEl = textRef.current;
    if (!section || !textEl) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const words = textEl.querySelectorAll<HTMLSpanElement>('.tagline-word');
    if (!words.length) return;

    // Word by word progressive illumination on scroll using B7 base curve
    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        end: 'bottom 50%',
        scrub: 0.6,
      },
    }).to(words, {
      color: '#FFFFFF',
      opacity: 1,
      stagger: 0.08,
      ease: 'power2.out',
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} id="tagline" className="tagline-section" aria-label="Core mission statement">
      <div className="tagline-container">
        <div className="tagline-eyebrow">
          <span className="tagline-pill">Independent sound</span>
        </div>

        <h2 ref={textRef} className="tagline-statement">
          {TAGLINE_LINES.map((line, lineIndex) => (
            <span key={lineIndex} className="tagline-line">
              {line.split(' ').map((word, wordIndex) => (
                <span key={wordIndex} className="tagline-word">
                  {word}{' '}
                </span>
              ))}
            </span>
          ))}
        </h2>

        <p className="tagline-footnote">
          Rated by verified listeners. Powered by transparent community voting.
        </p>
      </div>
    </section>
  );
}
