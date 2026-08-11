import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollExperienceSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;

    if (!container || !wrapper) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const cards = wrapper.querySelectorAll<HTMLDivElement>('.scroll-exp-card');
    if (!cards.length) return;

    // Master Pinned ScrollTrigger Timeline focused solely on the 5 interacting icons
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=1800',
        pin: wrapper,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    const colors = ['#7B61FF', '#3EC96A', '#FF5733', '#FFB830', '#4A90FF'];

    // ── Phase 1: Scale up, rotate 360, and move to centered alignment ──
    tl.to(
      cards,
      {
        scale: 1.3,
        rotation: 360,
        stagger: 0.08,
        ease: 'power2.inOut',
        duration: 0.8,
      },
      0
    );

    // ── Phase 2: Loading Wave Pop-In & Pop-Out (2-3 iteration pulse wave) ──
    cards.forEach((card, index) => {
      const startTime = 0.8 + index * 0.15;
      const activeColor = colors[index % colors.length];

      // Pop down small
      tl.to(
        card,
        {
          scale: 0.25,
          opacity: 0.35,
          duration: 0.15,
          ease: 'power1.in',
        },
        startTime
      );

      // Pop up big with active color vector drop-shadow glow (NO ugly dark box canvas)
      tl.to(
        card,
        {
          scale: 1.5,
          opacity: 1,
          filter: `drop-shadow(0 0 35px ${activeColor}) drop-shadow(0 15px 25px rgba(0,0,0,0.5))`,
          duration: 0.18,
          ease: 'back.out(2)',
        },
        startTime + 0.15
      );
    });

    // ── Phase 3: Recede into depth smoothly as scroll moves to next section ──
    tl.to(
      cards,
      {
        scale: 1.1,
        opacity: 1,
        y: 40,
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))',
        stagger: 0.05,
        duration: 0.5,
        ease: 'power2.out',
      },
      1.8
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} id="scroll-experience" className="scroll-exp-container">
      <div ref={wrapperRef} className="scroll-exp-viewport">
        {/* Ambient Dark Backdrop Glow */}
        <div className="scroll-exp-glow" />

        {/* 5 Clean Interacting Pure Vector Icons Layer */}
        <div className="scroll-exp-icons-wrapper">
          {/* 1. Violet Music Note */}
          <div className="scroll-exp-card icon-violet" title="Music & Audio">
            <svg viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="50" fill="#7B61FF" />
              <path d="M68 28V58C68 64.6 62.6 70 56 70C49.4 70 44 64.6 44 58C44 51.4 49.4 46 56 46C58.8 46 61.4 47 63.4 48.6V36L38 41V64C38 70.6 32.6 76 26 76C19.4 76 14 70.6 14 64C14 57.4 19.4 52 26 52C28.8 52 31.4 53 33.4 54.6V34C33.4 31.2 35.3 28.8 38.1 28.3L64.1 23.1C66.2 22.6 68 24.3 68 26.5V28Z" fill="#0A0A0A" />
            </svg>
          </div>

          {/* 2. Green Clapperboard */}
          <div className="scroll-exp-card icon-green" title="Cinema">
            <svg viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" rx="28" fill="#3EC96A" />
              <path d="M22 28H78C82.4 28 86 31.6 86 36V72C86 76.4 82.4 80 78 80H22C17.6 80 14 76.4 14 72V36C14 31.6 17.6 28 22 28Z" fill="#0A0A0A" />
              <path d="M22 28L34 42H22V28ZM42 28L54 42H42V28ZM62 28L74 42H62V28Z" fill="#3EC96A" />
            </svg>
          </div>

          {/* 3. Red Ghost Arrow */}
          <div className="scroll-exp-card icon-red" title="Spatial Web">
            <svg viewBox="0 0 120 100" fill="none">
              <path d="M0 24C0 10.7 10.7 0 24 0H70C83.3 0 94 10.7 94 24V32L120 50L94 68V76C94 89.3 83.3 100 70 100H24C10.7 100 0 89.3 0 76V24Z" fill="#FF5733" />
              <path d="M47 28C32 28 25 40 25 55V76L34 68L44 76L54 68L64 76L74 68L83 76V55C83 40 76 28 61 28H47Z" fill="#0A0A0A" />
              <circle cx="43" cy="46" r="5" fill="#FF5733" />
              <circle cx="65" cy="46" r="5" fill="#FF5733" />
            </svg>
          </div>

          {/* 4. Yellow Shopping Bag */}
          <div className="scroll-exp-card icon-yellow" title="Merch & Rewards">
            <svg viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" rx="28" fill="#FFB830" />
              <path d="M25 42L22 80H78L75 42H25Z" fill="#0A0A0A" />
              <path d="M36 42V32C36 24.3 42.3 18 50 18C57.7 18 64 24.3 64 32V42" stroke="#0A0A0A" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </div>

          {/* 5. Blue Badges T-shirt */}
          <div className="scroll-exp-card icon-blue" title="Custom Wear & Badges">
            <svg viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="50" fill="#4A90FF" />
              <path d="M32 25L18 36L26 50L34 44V78H66V44L74 50L82 36L68 25C68 25 60 32 50 32C40 32 32 25 32 25Z" fill="#0A0A0A" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
