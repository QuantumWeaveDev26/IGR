import React, { useEffect, useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ProgressRail } from './components/ProgressRail';
import { CursorOrbit } from './components/CursorOrbit';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ManifestoSection } from './components/ManifestoSection';
import { AppuSection } from './components/AppuSection';
import { RouteSection } from './components/RouteSection';
import { ResultsSection } from './components/ResultsSection';
import { DifferenceSection } from './components/DifferenceSection';
import { AudienceSection } from './components/AudienceSection';
import { FinalCTA } from './components/FinalCTA';
import { VideoModal } from './components/VideoModal';
import { EarlyAccessModal } from './components/EarlyAccessModal';
import { AppuChatWidget } from './components/AppuChatWidget';

export const App: React.FC = () => {
  const [isEarlyAccessOpen, setIsEarlyAccessOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealTargets = Array.from(
      document.querySelectorAll(
        '.manifesto h2, .appu-section h2, .route-title h2, .results h2, .difference h2, .final h2, .section-head h2'
      )
    );

    if ('IntersectionObserver' in window && !reduceMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
            }
          });
        },
        { threshold: 0.18 }
      );
      revealTargets.forEach((el) => observer.observe(el));

      return () => {
        revealTargets.forEach((el) => observer.unobserve(el));
      };
    } else {
      revealTargets.forEach((el) => el.classList.add('in-view'));
    }
  }, []);

  return (
    <LanguageProvider>
      <CursorOrbit />
      <ProgressRail />
      <Navbar onOpenEarlyAccess={() => setIsEarlyAccessOpen(true)} />
      <main>
        {/* Section 00: Hero & Interactive Route Map */}
        <Hero
          onOpenEarlyAccess={() => setIsEarlyAccessOpen(true)}
          onOpenVideoModal={() => setIsVideoModalOpen(true)}
        />

        {/* Section 01: Manifesto / Starting Point */}
        <ManifestoSection />

        {/* Section 02: Meet IGr & APPU */}
        <AppuSection />

        {/* Section 03: Route Atlas */}
        <RouteSection />

        {/* Section 04: Results Within 40 Hours */}
        <ResultsSection />

        {/* Section 05: Traditional vs IGr Comparison */}
        <DifferenceSection />

        {/* Section 06: Target Audience */}
        <AudienceSection />

        {/* Final CTA & Footer */}
        <FinalCTA onOpenEarlyAccess={() => setIsEarlyAccessOpen(true)} />
      </main>

      {/* Floating APPU AI Assistant Chat Widget */}
      <AppuChatWidget onOpenEarlyAccess={() => setIsEarlyAccessOpen(true)} />

      {/* Interactive Modals */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
      <EarlyAccessModal
        isOpen={isEarlyAccessOpen}
        onClose={() => setIsEarlyAccessOpen(false)}
      />
    </LanguageProvider>
  );
};

export default App;
