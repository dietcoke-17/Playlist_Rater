import { useEffect, useState, useCallback } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import LeaderboardPage from './components/LeaderboardPage';
import PopularPage from './components/PopularPage';
import type { Playlist } from './data/playlists';

gsap.registerPlugin(ScrollTrigger);

type AppView = 'home' | 'login' | 'leaderboard' | 'popular';

function getInitialView(): AppView {
  const path = window.location.pathname;
  if (path === '/login' || window.location.hash === '#login') return 'login';
  if (path === '/leaderboard' || window.location.hash === '#leaderboard') return 'leaderboard';
  if (path === '/popular' || path === '/curators' || window.location.hash === '#popular' || window.location.hash === '#curators') return 'popular';
  return 'home';
}

function MainAppContent() {
  const [view, setView] = useState<AppView>(getInitialView);
  const [openPublishModalDirectly, setOpenPublishModalDirectly] = useState(false);

  const navigateTo = useCallback((newView: AppView) => {
    setView(newView);
    const targetPath = newView === 'home' ? '/' : `/${newView}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ view: newView }, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen for browser Back & Forward button navigation
  useEffect(() => {
    const handlePopState = () => {
      setView(getInitialView());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initialize Lenis Smooth Scroll on Home view
  useEffect(() => {
    if (view !== 'home') return;

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
  }, [view]);

  // When a playlist is selected from directory
  const handleSelectPlaylist = useCallback((playlist: Playlist) => {
    const converterEl = document.getElementById('converter');
    if (converterEl && view === 'home') {
      converterEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(playlist.sampleUrl, '_blank', 'noopener,noreferrer');
    }
  }, [view]);

  if (view === 'login') {
    return <LoginPage onBack={() => navigateTo('home')} />;
  }

  if (view === 'popular') {
    return (
      <PopularPage
        onBack={() => {
          setOpenPublishModalDirectly(false);
          navigateTo('home');
        }}
        onSelectPlaylist={handleSelectPlaylist}
        initialOpenPublish={openPublishModalDirectly}
      />
    );
  }

  if (view === 'leaderboard') {
    return (
      <LeaderboardPage
        onBack={() => navigateTo('home')}
        onSelectPlaylist={handleSelectPlaylist}
      />
    );
  }

  return (
    <div className="app">
      {/* Floating Timmo capsule navbar with login pill */}
      <Navbar
        onOpenLogin={() => navigateTo('login')}
        onOpenLeaderboard={() => navigateTo('leaderboard')}
        onOpenPopular={() => {
          setOpenPublishModalDirectly(false);
          navigateTo('popular');
        }}
        onGoHome={() => navigateTo('home')}
        currentView={view}
      />

      <main id="main-content">
        {/* Landing Page: Universal Converter and button to Public Curators */}
        <Hero
          onOpenLogin={() => navigateTo('login')}
          onOpenCuratorsDirectory={() => {
            setOpenPublishModalDirectly(false);
            navigateTo('popular');
          }}
          onOpenPublishModal={() => {
            setOpenPublishModalDirectly(true);
            navigateTo('popular');
          }}
        />
      </main>

      {/* Minimal clean footer */}
      <Footer onOpenCurators={() => navigateTo('popular')} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
