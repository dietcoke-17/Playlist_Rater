import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HomeStatementSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function HomeStatementSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const words = container.querySelectorAll<HTMLSpanElement>('.reveal-word');
    const exitBlock1 = container.querySelector<HTMLDivElement>('.block-problem');
    const exitBlock2 = container.querySelector<HTMLDivElement>('.block-solution');

    if (!words.length) return;

    // Entrance Scroll: Progressive word by word reveal
    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'center 40%',
        scrub: 0.8,
      },
    }).to(words, {
      opacity: 1,
      filter: 'blur(0px)',
      stagger: 0.04,
      ease: 'power1.out',
    });

    // Exit Scroll: Smooth upward recess
    if (exitBlock1) {
      gsap.to(exitBlock1, {
        scrollTrigger: {
          trigger: section,
          start: 'center 30%',
          end: 'bottom 10%',
          scrub: 0.8,
        },
        opacity: 0.2,
        y: -32,
        filter: 'blur(3px)',
        ease: 'power2.in',
      });
    }

    if (exitBlock2) {
      gsap.to(exitBlock2, {
        scrollTrigger: {
          trigger: section,
          start: 'center 20%',
          end: 'bottom 5%',
          scrub: 0.8,
        },
        opacity: 0.3,
        y: -20,
        ease: 'power2.in',
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} id="problem-solution" className="home-statement-section" aria-label="Problem and solution">
      <div ref={containerRef} className="home-statement-container">
        {/* 1. Problem Statement */}
        <div className="statement-block block-problem">
          <div className="statement-tag problem-tag">
            <span className="statement-tag-dot" aria-hidden="true" /> The problem
          </div>
          <h2 className="statement-text">
            <span className="badge-inline-pill">
              <span className="badge-icon">❖</span> Walled gardens
            </span>{' '}
            <span className="reveal-word">trap</span>{' '}
            <span className="reveal-word">your</span>{' '}
            <span className="reveal-word">music.</span>{' '}
            <span className="reveal-word">When</span>{' '}
            <span className="reveal-word">friends</span>{' '}
            <span className="reveal-word">share</span>{' '}
            <span className="reveal-word">playlists</span>{' '}
            <span className="reveal-word">from</span>{' '}
            <span className="reveal-word">another</span>{' '}
            <span className="reveal-word">app,</span>{' '}
            <span className="reveal-word">you</span>{' '}
            <span className="reveal-word">hit</span>{' '}
            <span className="reveal-word">a</span>{' '}
            <span className="reveal-word">wall,</span>{' '}
            <span className="reveal-word">while</span>{' '}
            <span className="reveal-word">streaming</span>{' '}
            <span className="reveal-word">algorithms</span>{' '}
            <span className="reveal-word">flatten</span>{' '}
            <span className="reveal-word">everything</span>{' '}
            <span className="reveal-word">into</span>{' '}
            <span className="reveal-word">recycled</span>{' '}
            <span className="reveal-word">commercial</span>{' '}
            <span className="reveal-word">tracks.</span>
          </h2>
        </div>

        {/* 2. Solution Statement */}
        <div className="statement-block block-solution">
          <div className="statement-tag solution-tag">
            <span className="statement-tag-dot solution-dot" aria-hidden="true" /> The solution
          </div>
          <h3 className="statement-heading-sub">
            <span className="reveal-word">One</span>{' '}
            <span className="reveal-word">endpoint</span>{' '}
            <span className="reveal-word">connecting</span>{' '}
            <span className="reveal-word">every</span>{' '}
            <span className="reveal-word">playlist.</span>
          </h3>
          <p className="statement-text-secondary">
            <span className="reveal-word">With</span>{' '}
            <span className="brand-badge-pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect width="24" height="24" rx="5" fill="#FFFFFF" />
                <path fillRule="evenodd" clipRule="evenodd" d="M7 5H13.5C16.5 5 18.5 7 18.5 10C18.5 13 16.5 15 13.5 15H10V19H7V5ZM10 8V12H13C14.2 12 15.2 11.2 15.2 10C15.2 8.8 14.2 8 13 8H10Z" fill="#000000" />
              </svg>
              <span>Playlitfy</span>
            </span>{' '}
            <span className="reveal-word">you</span>{' '}
            <span className="reveal-word">can</span>{' '}
            <span className="reveal-word">fetch</span>{' '}
            <span className="reveal-word">any</span>{' '}
            <span className="reveal-word">public</span>{' '}
            <span className="reveal-word">link,</span>{' '}
            <span className="reveal-word">launch</span>{' '}
            <span className="reveal-word">in</span>{' '}
            <span className="reveal-word">your</span>{' '}
            <span className="reveal-word">native</span>{' '}
            <span className="reveal-word">app,</span>{' '}
            <span className="reveal-word">recreate</span>{' '}
            <span className="reveal-word">tracks</span>{' '}
            <span className="reveal-word">across</span>{' '}
            <span className="reveal-word">services,</span>{' '}
            <span className="reveal-word">and</span>{' '}
            <span className="reveal-word">rate</span>{' '}
            <span className="reveal-word">curation</span>{' '}
            <span className="reveal-word">on</span>{' '}
            <span className="reveal-word">a</span>{' '}
            <span className="reveal-word">pure</span>{' '}
            <span className="reveal-word">1</span>{' '}
            <span className="reveal-word">to</span>{' '}
            <span className="reveal-word">10</span>{' '}
            <span className="reveal-word">scale.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
