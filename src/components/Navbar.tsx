import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { WhatsappLogo } from '@phosphor-icons/react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onOpenEarlyAccess?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const navRef = useRef<HTMLElement>(null);
  const { lang, setLang, t } = useLanguage();
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
          {t('nav.brand')}
          <small>{t('nav.brandSub')}</small>
        </div>
        <div className="nav-links">
          <a href="#why">{t('nav.why')}</a>
          <a href="#journey">{t('nav.howItWorks')}</a>
          <a href="#results">{t('nav.results')}</a>
          <div className="language-switch" style={{ display: 'inline-flex', gap: '0', marginLeft: '8px' }}>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`lang-toggle-btn${lang === 'en' ? ' lang-active' : ''}`}
              style={{
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: lang === 'en' ? 700 : 500,
                background: lang === 'en' ? 'var(--forest, #264538)' : 'transparent',
                color: lang === 'en' ? '#fff' : 'var(--ink, #1a1a1a)',
                border: '1px solid var(--forest, #264538)',
                borderRadius: '6px 0 0 6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.04em',
              }}
            >
              ENG
            </button>
            <button
              type="button"
              onClick={() => setLang('kn')}
              className={`lang-toggle-btn${lang === 'kn' ? ' lang-active' : ''}`}
              style={{
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: lang === 'kn' ? 700 : 500,
                background: lang === 'kn' ? 'var(--forest, #264538)' : 'transparent',
                color: lang === 'kn' ? '#fff' : 'var(--ink, #1a1a1a)',
                border: '1px solid var(--forest, #264538)',
                borderLeft: 'none',
                borderRadius: '0 6px 6px 0',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              lang="kn"
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
            <span>{t('nav.whatsapp')}</span>
            <span className="arrow">↗</span>
          </a>
        </div>
      </nav>
    </div>
  );
};
