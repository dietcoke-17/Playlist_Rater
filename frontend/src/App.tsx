import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HomeStatementSection from './components/HomeStatementSection';
import BenefitsSection from './components/BenefitsSection';
import HowItWorksSection from './components/HowItWorksSection';
import ProductProofSection from './components/ProductProofSection';
import TaglineSection from './components/TaglineSection';
import FaqSection from './components/FaqSection';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  // Initialize Lenis Smooth Scroll synced with GSAP ScrollTrigger
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let reqId: number;
    function raf(time: number) {
      lenis.raf(time);
      reqId = requestAnimationFrame(raf);
    }
    reqId = requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    // Initial hash scroll support
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const target = document.getElementById(id);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }

    return () => {
      cancelAnimationFrame(reqId);
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="app">
      {/* Liquid Glass Centered Navbar */}
      <Navbar />

      <main id="main-content">
        {/* Above the fold: Hero Landing Section */}
        <Hero />

        {/* 1. Problem and solution */}
        <HomeStatementSection />

        {/* 2. Three to five benefits tied to real product outcomes */}
        <BenefitsSection />

        {/* 3. How the product works, using three clear steps */}
        <HowItWorksSection />

        {/* 4. Product proof, screenshots or real customer evidence */}
        <ProductProofSection />

        {/* 5. A distinctive benefit or tagline section */}
        <TaglineSection />

        {/* 6. FAQ addressing the actual objections */}
        <FaqSection />

        {/* 7. Final CTA */}
        <CtaSection />
      </main>

      {/* Complete Footer */}
      <Footer />
    </div>
  );
}
