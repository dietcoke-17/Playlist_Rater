import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './IconsFinaleSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function IconsFinaleSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    const iconsGroup = iconsRef.current;

    if (!container || !wrapper || !iconsGroup) return;

    const cards = iconsGroup.querySelectorAll<HTMLDivElement>('.finale-icon-card');
    if (!cards.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Pin section during the 300vh scroll sequence
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=250%',
        pin: wrapper,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    const colors = ['#7B61FF', '#3EC96A', '#FF5733', '#FFB830', '#4A90FF'];

    // ── CYCLE 1: First icon gets very small (0.25), last stays large, others pulse ──
    tl.to(cards[0], { scale: 0.25, opacity: 0.4, y: 30, duration: 0.4 }, 0)
      .to(cards[4], { scale: 1.3, opacity: 1, y: -15, boxShadow: `0 0 40px ${colors[4]}`, duration: 0.4 }, 0)
      .to(cards[1], { scale: 1.25, opacity: 1, boxShadow: `0 0 30px ${colors[1]}`, duration: 0.4 }, 0)
      .to(cards[2], { scale: 0.3, opacity: 0.5, duration: 0.4 }, 0)
      .to(cards[3], { scale: 1.2, opacity: 1, duration: 0.4 }, 0);

    // ── CYCLE 2: First icon gets BIG, last icon gets very small, others toggle ──
    tl.to(cards[0], { scale: 1.4, opacity: 1, y: -25, boxShadow: `0 0 50px ${colors[0]}`, duration: 0.4 }, 0.4)
      .to(cards[4], { scale: 0.25, opacity: 0.4, y: 30, boxShadow: 'none', duration: 0.4 }, 0.4)
      .to(cards[1], { scale: 0.3, opacity: 0.5, duration: 0.4 }, 0.4)
      .to(cards[2], { scale: 1.35, opacity: 1, boxShadow: `0 0 45px ${colors[2]}`, duration: 0.4 }, 0.4)
      .to(cards[3], { scale: 0.35, opacity: 0.5, duration: 0.4 }, 0.4);

    // ── CYCLE 3: Pulse wave repeat ──
    tl.to(cards[0], { scale: 0.3, opacity: 0.5, y: 10, duration: 0.4 }, 0.8)
      .to(cards[1], { scale: 1.35, opacity: 1, y: -20, boxShadow: `0 0 45px ${colors[1]}`, duration: 0.4 }, 0.8)
      .to(cards[2], { scale: 0.3, opacity: 0.4, duration: 0.4 }, 0.8)
      .to(cards[3], { scale: 1.4, opacity: 1, y: -25, boxShadow: `0 0 50px ${colors[3]}`, duration: 0.4 }, 0.8)
      .to(cards[4], { scale: 1.3, opacity: 1, y: -15, boxShadow: `0 0 40px ${colors[4]}`, duration: 0.4 }, 0.8);

    // ── FINALE: All 5 icons gather into the exact center of full screen viewport ──
    tl.to('.finale-title', { opacity: 1, y: 0, duration: 0.3 }, 1.2);
    tl.to('.finale-subtitle', { opacity: 1, y: 0, duration: 0.3 }, 1.3);

    cards.forEach((card, i) => {
      tl.to(
        card,
        {
          scale: 1.35,
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          boxShadow: `0 0 60px ${colors[i]}, 0 30px 60px rgba(0,0,0,0.8)`,
          duration: 0.5,
          ease: 'back.out(1.8)',
        },
        1.4
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} id="icons-finale-trigger" className="finale-scroll-container">
      <div ref={wrapperRef} className="finale-pin-wrapper">
        {/* Dynamic Background Glow based on active card */}
        <div
          className="finale-bg-aura"
          style={{
            background: activeCategory
              ? `radial-gradient(circle, ${activeCategory} 0%, rgba(10,10,18,0) 70%)`
              : 'radial-gradient(circle, rgba(123,97,255,0.15) 0%, rgba(10,10,18,0) 70%)',
          }}
        />

        <div className="finale-content">
          <h2 className="finale-title">
            Spatial Ecosystem <span className="title-gradient">Loaded</span>
          </h2>
          <p className="finale-subtitle">
            Hover or click any centered icon to inspect your spatial web rewards.
          </p>

          {/* Centered Icons Cluster */}
          <div ref={iconsRef} className="finale-icons-grid">
            {/* 1. Violet - Music */}
            <div
              className="finale-icon-card icon-violet"
              onClick={() => setActiveCategory('rgba(123, 97, 255, 0.4)')}
            >
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="50" fill="#7B61FF" />
                <path d="M68 28V58C68 64.6274 62.6274 70 56 70C49.3726 70 44 64.6274 44 58C44 51.3726 49.3726 46 56 46C58.8 46 61.35 46.96 63.38 48.57V36L38 41V64C38 70.6274 32.6274 76 26 76C19.3726 76 14 70.6274 14 64C14 57.3726 19.3726 52 26 52C28.8 52 31.35 52.96 33.38 54.57V34C33.38 31.2 35.34 28.8 38.08 28.26L64.08 23.06C66.24 22.63 68 24.28 68 26.48V28Z" fill="#0A0A0A" />
              </svg>
              <span className="card-label">Music</span>
            </div>

            {/* 2. Green - Video */}
            <div
              className="finale-icon-card icon-green"
              onClick={() => setActiveCategory('rgba(62, 201, 106, 0.4)')}
            >
              <svg viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" rx="28" fill="#3EC96A" />
                <path d="M22 28H78C82.4 28 86 31.6 86 36V72C86 76.4 82.4 80 78 80H22C17.6 80 14 76.4 14 72V36C14 31.6 17.6 28 22 28Z" fill="#0A0A0A" />
                <path d="M22 28L34 42H22V28ZM42 28L54 42H42V28ZM62 28L74 42H62V28Z" fill="#3EC96A" />
              </svg>
              <span className="card-label">Cinema</span>
            </div>

            {/* 3. Red - Gaming/Spatial */}
            <div
              className="finale-icon-card icon-red"
              onClick={() => setActiveCategory('rgba(255, 87, 51, 0.4)')}
            >
              <svg viewBox="0 0 120 100" fill="none">
                <path d="M0 24C0 10.7452 10.7452 0 24 0H70C83.2548 0 94 10.7452 94 24V32L120 50L94 68V76C94 89.2548 83.2548 100 70 100H24C10.7452 100 0 89.2548 0 76V24Z" fill="#FF5733" />
                <path d="M47 28C32 28 25 40 25 55V76L34 68L44 76L54 68L64 76L74 68L83 76V55C83 40 76 28 61 28H47Z" fill="#0A0A0A" />
                <circle cx="43" cy="46" r="5" fill="#FF5733" />
                <circle cx="65" cy="46" r="5" fill="#FF5733" />
              </svg>
              <span className="card-label">Spatial</span>
            </div>

            {/* 4. Yellow - Merch */}
            <div
              className="finale-icon-card icon-yellow"
              onClick={() => setActiveCategory('rgba(255, 184, 48, 0.4)')}
            >
              <svg viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" rx="28" fill="#FFB830" />
                <path d="M25 42L22 80H78L75 42H25Z" fill="#0A0A0A" />
                <path d="M36 42V32C36 24.268 42.268 18 50 18C57.732 18 64 24.268 64 32V42" stroke="#0A0A0A" strokeWidth="8" strokeLinecap="round" />
              </svg>
              <span className="card-label">Store</span>
            </div>

            {/* 5. Blue - Badges */}
            <div
              className="finale-icon-card icon-blue"
              onClick={() => setActiveCategory('rgba(74, 144, 255, 0.4)')}
            >
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="50" fill="#4A90FF" />
                <path d="M32 25L18 36L26 50L34 44V78H66V44L74 50L82 36L68 25C68 25 60 32 50 32C40 32 32 25 32 25Z" fill="#0A0A0A" />
              </svg>
              <span className="card-label">Badges</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
