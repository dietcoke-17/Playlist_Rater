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
              <span className="badge-icon">❖</span> Your playlists
            </span>{' '}
            <span className="reveal-word">reflect</span>{' '}
            <span className="reveal-word">your</span>{' '}
            <span className="reveal-word">true</span>{' '}
            <span className="reveal-word">musical</span>{' '}
            <span className="reveal-word">identity,</span>{' '}
            <span className="reveal-word">yet</span>{' '}
            <span className="reveal-word">streaming</span>{' '}
            <span className="reveal-word">algorithms</span>{' '}
            <span className="reveal-word">flatten</span>{' '}
            <span className="reveal-word">everything</span>{' '}
            <span className="reveal-word">into</span>{' '}
            <span className="reveal-word">monotonous</span>{' '}
            <span className="reveal-word">recommendations</span>{' '}
            <span className="reveal-word">without</span>{' '}
            <span className="reveal-word">ever</span>{' '}
            <span className="reveal-word">giving</span>{' '}
            <span className="reveal-word">independent</span>{' '}
            <span className="reveal-word">curators</span>{' '}
            <span className="reveal-word">the</span>{' '}
            <span className="reveal-word">recognition</span>{' '}
            <span className="reveal-word">they</span>{' '}
            <span className="reveal-word">earn.</span>
          </h2>
        </div>

        {/* 2. Solution Statement */}
        <div className="statement-block block-solution">
          <div className="statement-tag solution-tag">
            <span className="statement-tag-dot solution-dot" aria-hidden="true" /> The solution
          </div>
          <h3 className="statement-heading-sub">
            <span className="reveal-word">A</span>{' '}
            <span className="reveal-word">transparent</span>{' '}
            <span className="reveal-word">community</span>{' '}
            <span className="reveal-word">scoring</span>{' '}
            <span className="reveal-word">system.</span>
          </h3>
          <p className="statement-text-secondary">
            <span className="reveal-word">With</span>{' '}
            <span className="brand-badge-pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect width="24" height="24" rx="6" fill="#FF5733" />
                <path d="M7 17L17 7M17 7H9M17 7V15" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>PlaylistIQ</span>
            </span>{' '}
            <span className="reveal-word">you</span>{' '}
            <span className="reveal-word">explore</span>{' '}
            <span className="reveal-word">playlists</span>{' '}
            <span className="reveal-word">scored</span>{' '}
            <span className="reveal-word">1</span>{' '}
            <span className="reveal-word">to</span>{' '}
            <span className="reveal-word">10</span>{' '}
            <span className="reveal-word">by</span>{' '}
            <span className="reveal-word">real</span>{' '}
            <span className="reveal-word">listeners,</span>{' '}
            <span className="reveal-word">inspect</span>{' '}
            <span className="reveal-word">harmonic</span>{' audio '}
            <span className="reveal-word">analytics,</span>{' '}
            <span className="reveal-word">and</span>{' '}
            <span className="reveal-word">climb</span>{' '}
            <span className="reveal-word">global</span>{' '}
            <span className="reveal-word">charts</span>{' '}
            <span className="reveal-word">based</span>{' '}
            <span className="reveal-word">strictly</span>{' '}
            <span className="reveal-word">on</span>{' '}
            <span className="reveal-word">track</span>{' '}
            <span className="reveal-word">flow</span>{' '}
            <span className="reveal-word">and</span>{' '}
            <span className="reveal-word">sonic</span>{' '}
            <span className="reveal-word">quality.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
