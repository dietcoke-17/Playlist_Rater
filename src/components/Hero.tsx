import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const iconsRowRef = useRef<HTMLDivElement>(null);

  // Target slots inside NVG8 text lines
  const target1Ref = useRef<HTMLSpanElement>(null);
  const target2Ref = useRef<HTMLSpanElement>(null);
  const target3Ref = useRef<HTMLSpanElement>(null);
  const target4Ref = useRef<HTMLSpanElement>(null);
  const target5Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const rowEl = iconsRowRef.current;

    if (!container || !rowEl) return;

    const cards = rowEl.querySelectorAll<HTMLDivElement>('.hero-icon-card');
    const targetSlots = [
      target1Ref.current,
      target2Ref.current,
      target3Ref.current,
      target4Ref.current,
      target5Ref.current,
    ];

    if (cards.length !== 5) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Initial Entrance Spring Pop-In under CTA button
    gsap.fromTo(
      cards,
      {
        scale: 0,
        y: -15,
        opacity: 0,
        rotation: (i) => (i % 2 === 0 ? -12 : 12),
      },
      {
        scale: 1,
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(2)',
      }
    );

    const colors = ['#7B61FF', '#3EC96A', '#FF5733', '#FFB830', '#4A90FF'];

    // Master ScrollTrigger Timeline: 100% Physical Path Trajectory & Exact Text Docking (NO FADE)
    gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;

          cards.forEach((card, index) => {
            const targetEl = targetSlots[index];
            if (!targetEl) return;

            // Reset transforms temporarily to compute absolute delta offset between initial card & target slot
            gsap.set(card, { x: 0, y: 0 });
            const cardRect = card.getBoundingClientRect();
            const targetRect = targetEl.getBoundingClientRect();

            const deltaX = targetRect.left - cardRect.left + (targetRect.width - cardRect.width) / 2;
            const deltaY = targetRect.top - cardRect.top + (targetRect.height - cardRect.height) / 2;

            const activeColor = colors[index % colors.length];

            // 1. Curved Flight Path Trajectory (X linear, Y parabolic arc)
            const curX = deltaX * p;
            const arcY = Math.sin(p * Math.PI) * -35;
            const curY = deltaY * p + arcY;

            // 2. Smooth scale down to match inline line height (1.0 -> 0.85)
            const curScale = 1 - p * 0.15 + Math.sin(p * Math.PI) * 0.15;

            // 3. Rotation straightens out to 0deg when seated in place
            const initialRot = index % 2 === 0 ? -12 : 12;
            const curRot = initialRot * (1 - p);

            // 4. Glow halo during flight, settling cleanly when seated
            const filterEffect =
              p > 0.05 && p < 0.95
                ? `drop-shadow(0 0 25px ${activeColor}) drop-shadow(0 15px 25px rgba(0,0,0,0.5))`
                : 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))';

            // NO OPACITY FADE: Keep opacity at 1.0 throughout the entire physical path!
            gsap.set(card, {
              x: curX,
              y: curY,
              scale: curScale,
              rotation: curRot,
              opacity: 1,
              filter: filterEffect,
            });
          });
        },
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} id="home" className="hero-section">
      {/* Decorative Side Graphic Arrow Banners */}
      <div className="hero-side-shapes" aria-hidden="true">
        <div className="shape-arrow shape-red" />
        <div className="shape-arrow shape-blue" />
        <div className="shape-arrow shape-yellow" />
      </div>

      <div className="hero-container">
        {/* Top Landing View Headline */}
        <h1 className="hero-title">
          <span>Your playlist runs</span>
          <span>the world</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Start rating and discovering the best music today.
        </p>

        {/* Action Button - Lime Green Pill */}
        <div className="hero-cta-wrap">
          <a href="#playlists" className="lime-pill-btn">
            <span className="lime-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="#0A0A0A" />
              </svg>
            </span>
            Explore Playlist Rater
          </a>
        </div>

        {/* 5 Physical Interacting Vector Icons (Starts under button & travels along path into text lines) */}
        <div ref={iconsRowRef} className="hero-icons-row" aria-label="Feature categories">
          {/* 1. Violet Circle - Music Note */}
          <div className="hero-icon-card icon-violet" title="Playlists">
            <svg viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="50" fill="#7B61FF" />
              <path d="M68 28V58C68 64.6 62.6 70 56 70C49.4 70 44 64.6 44 58C44 51.4 49.4 46 56 46C58.8 46 61.4 47 63.4 48.6V36L38 41V64C38 70.6 32.6 76 26 76C19.4 76 14 70.6 14 64C14 57.4 19.4 52 26 52C28.8 52 31.4 53 33.4 54.6V34C33.4 31.2 35.3 28.8 38.1 28.3L64.1 23.1C66.2 22.6 68 24.3 68 26.5V28Z" fill="#0A0A0A" />
            </svg>
          </div>

          {/* 2. Green Squircle - Cinema / Tracks */}
          <div className="hero-icon-card icon-green" title="Top Tracks">
            <svg viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" rx="28" fill="#3EC96A" />
              <path d="M22 28H78C82.4 28 86 31.6 86 36V72C86 76.4 82.4 80 78 80H22C17.6 80 14 76.4 14 72V36C14 31.6 17.6 28 22 28Z" fill="#0A0A0A" />
              <path d="M22 28L34 42H22V28ZM42 28L54 42H42V28ZM62 28L74 42H62V28Z" fill="#3EC96A" />
            </svg>
          </div>

          {/* 3. Red Ghost Arrow - Music Vibes */}
          <div className="hero-icon-card icon-red" title="Music Vibes">
            <svg viewBox="0 0 120 100" fill="none">
              <path d="M0 24C0 10.7 10.7 0 24 0H70C83.3 0 94 10.7 94 24V32L120 50L94 68V76C94 89.3 83.3 100 70 100H24C10.7 100 0 89.3 0 76V24Z" fill="#FF5733" />
              <path d="M47 28C32 28 25 40 25 55V76L34 68L44 76L54 68L64 76L74 68L83 76V55C83 40 76 28 61 28H47Z" fill="#0A0A0A" />
              <circle cx="43" cy="46" r="5" fill="#FF5733" />
              <circle cx="65" cy="46" r="5" fill="#FF5733" />
            </svg>
          </div>

          {/* 4. Yellow Shopping Bag - Listening Rewards */}
          <div className="hero-icon-card icon-yellow" title="Rewards">
            <svg viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" rx="28" fill="#FFB830" />
              <path d="M25 42L22 80H78L75 42H25Z" fill="#0A0A0A" />
              <path d="M36 42V32C36 24.3 42.3 18 50 18C57.7 18 64 24.3 64 32V42" stroke="#0A0A0A" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </div>

          {/* 5. Blue Badges T-shirt - Listening Habits */}
          <div className="hero-icon-card icon-blue" title="Habits & Badges">
            <svg viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="50" fill="#4A90FF" />
              <path d="M32 25L18 36L26 50L34 44V78H66V44L74 50L82 36L68 25C68 25 60 32 50 32C40 32 32 25 32 25Z" fill="#0A0A0A" />
            </svg>
          </div>
        </div>

        {/* NVG8 Typography Target Docking Section - Exact 4-Line Format matching user screenshot */}
        <div className="hero-nvg8-absorption-wrap">
          <div className="caption-wrap">
            <span className="caption-label">Here’s a fun fact:</span>
            <span className="caption-sub">Today, your playlist rules the web</span>
          </div>

          <h2 className="nvg8-title-display">
            <div className="title-row">
              <span>Your favorite</span>
              <span ref={target1Ref} className="inline-target-slot" />
              <span>playlists.</span>
            </div>

            <div className="title-row">
              <span>That</span>
              <span ref={target2Ref} className="inline-target-slot" />
              <span>top-rated track.</span>
            </div>

            <div className="title-row">
              <span>Your top</span>
              <span ref={target3Ref} className="inline-target-slot" />
              <span>music vibes and</span>
            </div>

            <div className="title-row">
              <span>all your listening</span>
              <span ref={target4Ref} className="inline-target-slot" />
              <span ref={target5Ref} className="inline-target-slot" />
              <span>habits.</span>
            </div>
          </h2>
        </div>
      </div>
    </section>
  );
}
