import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HomeStatementSection from './components/HomeStatementSection';
import ScrollExperienceSection from './components/ScrollExperienceSection';
import PlaylistsSection from './components/PlaylistsSection';
import TopRatedSection from './components/TopRatedSection';
import FeaturesSection from './components/FeaturesSection';
import FaqSection from './components/FaqSection';
import CtaSection from './components/CtaSection';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [route, setRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });

  // Handle URL hash routing
  useEffect(() => {
    const onHashChange = () => {
      const newHash = window.location.hash.replace('#', '') || 'home';
      setRoute(newHash);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

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

    return () => {
      cancelAnimationFrame(reqId);
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, [route]);

  return (
    <div className="app">
      {/* Liquid Glass Centered Navbar */}
      <Navbar currentRoute={route} />

      {/* Render Home Route Flow */}
      {route === 'home' && (
        <>
          {/* Main Hero Landing & Character-Aligned Icon Text Absorption Section */}
          <Hero />

          {/* Dark NVG8 Data Statement & Platform Mission Canvas */}
          <HomeStatementSection />

          {/* GSAP ScrollTrigger Interactive Wave Canvas */}
          <ScrollExperienceSection />
        </>
      )}

      {route === 'playlists' && (
        <div style={{ paddingTop: '80px' }}>
          <PlaylistsSection />
        </div>
      )}

      {route === 'top-playlists' && (
        <div style={{ paddingTop: '80px' }}>
          <TopRatedSection />
          <FeaturesSection />
        </div>
      )}

      {route === 'faq' && (
        <div style={{ paddingTop: '80px' }}>
          <FaqSection />
          <CtaSection />
        </div>
      )}
    </div>
  );
}
