import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { WhatsappLogo, Globe } from '@phosphor-icons/react';
import { useTranslation } from '../context/LanguageContext';

interface NavbarProps {
  onOpenEarlyAccess?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const navRef = useRef<HTMLElement>(null);
  const { language, setLanguage, t } = useTranslation();
  const waUrl = "https://wa.me/919740595677?text=Hi%20IGr%2C%20I%20would%20like%20to%20know%20more%20about%20APPU%20for%20CBSE%20learning.";

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <div className="wrap">
      <nav ref={navRef}>
        <div className="brand">
          IGr
          <small>{t.nav.brandSubtitle}</small>
        </div>
        <div className="nav-links flex items-center gap-3 sm:gap-4">
          <a href="#why">{t.nav.whyIgr}</a>
          <a href="#journey">{t.nav.howItWorks}</a>
          <a href="#results">{t.nav.results}</a>

          {/* Language Switcher Button (ENG | ಕನ್ನಡ) */}
          <div className="lang-switcher-pill flex items-center bg-stone-100 dark:bg-stone-800/60 p-1 rounded-full border border-stone-200 dark:border-stone-700 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#264538] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 dark:text-stone-400'
              }`}
              aria-label="Switch interface to English"
            >
              ENG
            </button>
            <button
              type="button"
              onClick={() => setLanguage('kn')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                language === 'kn'
                  ? 'bg-[#264538] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 dark:text-stone-400'
              }`}
              aria-label="Switch interface to Kannada"
            >
              ಕನ್ನಡ
            </button>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark !bg-emerald-700 !border-emerald-700 hover:!bg-emerald-800 text-white flex items-center gap-2"
          >
            <WhatsappLogo weight="fill" className="w-5 h-5 text-emerald-300" />
            <span>{t.nav.whatsappUs}</span>
            <span className="arrow">↗</span>
          </a>
        </div>
      </nav>
    </div>
  );
};
