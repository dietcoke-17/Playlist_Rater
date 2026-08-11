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
    const exitBlock1 = container.querySelector<HTMLDivElement>('.block-1');
    const exitBlock2 = container.querySelector<HTMLDivElement>('.block-2');

    if (!words.length) return;

    // 1. Entrance Scroll: Progressive word-by-word text lighting reveal ("loading screen" effect)
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
      stagger: 0.05,
      ease: 'power1.out',
    });

    // 2. Exit Scroll: Top text hides smoothly from the top as user scrolls past ("hiding from up")
    if (exitBlock1) {
      gsap.to(exitBlock1, {
        scrollTrigger: {
          trigger: section,
          start: 'center 30%',
          end: 'bottom 10%',
          scrub: 0.8,
        },
        opacity: 0.15,
        y: -40,
        filter: 'blur(4px)',
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
        opacity: 0.25,
        y: -25,
        ease: 'power2.in',
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="home-statement-section">
      <div ref={containerRef} className="home-statement-container">
        {/* Main Left-Aligned Dark Statement 1 Inside Centered Boundary Box */}
        <div className="statement-block block-1">
          <h2 className="statement-text">
            <span className="badge-inline-pill">
              <span className="badge-icon">❖</span> Your playlists
            </span>{' '}
            <span className="reveal-word">reflect</span>{' '}
            <span className="reveal-word">your</span>{' '}
            <span className="reveal-word">true</span>{' '}
            <span className="reveal-word">musical</span>{' '}
            <span className="reveal-word">identity,</span>{' '}
            <span className="reveal-word">but</span>{' '}
            <span className="reveal-word">streaming</span>{' '}
            <span className="reveal-word">algorithms</span>{' '}
            <span className="reveal-word">flatten</span>{' '}
            <span className="reveal-word">your</span>{' '}
            <span className="reveal-word">taste</span>{' '}
            <span className="reveal-word">into</span>{' '}
            <span className="reveal-word">generic</span>{' '}
            <span className="reveal-word">recommendations</span>{' '}
            <span className="reveal-word">without</span>{' '}
            <span className="reveal-word">giving</span>{' '}
            <span className="reveal-word">your</span>{' '}
            <span className="reveal-word">curated</span>{' '}
            <span className="reveal-word">taste</span>{' '}
            <span className="reveal-word">the</span>{' '}
            <span className="reveal-word">credit</span>{' '}
            <span className="reveal-word">it</span>{' '}
            <span className="reveal-word">deserves.</span>
          </h2>
        </div>

        {/* Main Left-Aligned Dark Statement 2 Inside Centered Boundary Box */}
        <div className="statement-block block-2">
          <h3 className="statement-heading-sub">
            <span className="reveal-word">It's</span>{' '}
            <span className="reveal-word">time</span>{' '}
            <span className="reveal-word">for</span>{' '}
            <span className="reveal-word">a</span>{' '}
            <span className="reveal-word">change.</span>
          </h3>
          <p className="statement-text-secondary">
            <span className="reveal-word">With</span>{' '}
            <span className="brand-badge-pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="6" fill="#FF5733" />
                <path d="M7 17L17 7M17 7H9M17 7V15" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Playlist Rater</span>
            </span>{' '}
            <span className="reveal-word">you</span>{' '}
            <span className="reveal-word">join</span>{' '}
            <span className="reveal-word">an</span>{' '}
            <span className="reveal-word">intelligent</span>{' '}
            <span className="reveal-word">music</span>{' '}
            <span className="reveal-word">analytics</span>{' '}
            <span className="reveal-word">platform</span>{' '}
            <span className="reveal-word">that</span>{' '}
            <span className="reveal-word">rates</span>{' '}
            <span className="reveal-word">your</span>{' '}
            <span className="reveal-word">playlists,</span>{' '}
            <span className="reveal-word">ranks</span>{' '}
            <span className="reveal-word">your</span>{' '}
            <span className="reveal-word">curated</span>{' '}
            <span className="reveal-word">tracks</span>{' '}
            <span className="reveal-word">across</span>{' '}
            <span className="reveal-word">global</span>{' '}
            <span className="reveal-word">community</span>{' '}
            <span className="reveal-word">leaderboards,</span>{' '}
            <span className="reveal-word">and</span>{' '}
            <span className="reveal-word">rewards</span>{' '}
            <span className="reveal-word">you</span>{' '}
            <span className="reveal-word">for</span>{' '}
            <span className="reveal-word">discovering</span>{' '}
            <span className="reveal-word">top-tier</span>{' '}
            <span className="reveal-word">music.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
