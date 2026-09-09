import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { WhatsappLogo } from '@phosphor-icons/react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onOpenEarlyAccess?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const navRef = useRef<HTMLElement>(null);
  const { lang, setLang, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const waUrl = "https://wa.me/919740595677?text=Hi%20IGr%2C%20I%20would%20like%20to%20know%20more%20about%20APPU%20for%20CBSE%20learning.";

  // Entrance animation: clear transform property once finished so it never interferes with sticky positioning
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { opacity: 0, y: -14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          clearProps: 'transform'
        }
      );
    }
  }, []);

  // Track scroll position to update header opacity/shadow without causing height or layout shifts
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu if resized to desktop viewport
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 820 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`site-header${isScrolled ? ' is-scrolled' : ''}`}>
      <div className="wrap nav-wrap">
        <nav ref={navRef} className="site-nav">
          {/* Left: Brand / Logo */}
          <div className="nav-brand-area">
            <a href="#top" className="brand" onClick={handleLinkClick}>
              {t('nav.brand')}
              <small>{t('nav.brandSub')}</small>
            </a>
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="nav-center-links">
            <a href="#why">{t('nav.why')}</a>
            <a href="#journey">{t('nav.howItWorks')}</a>
            <a href="#results">{t('nav.results')}</a>
          </div>

          {/* Right: Language switch + Primary CTA + Mobile Hamburger */}
          <div className="nav-actions-area">
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
                aria-label="Switch to English"
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
                aria-label="Switch to Kannada"
              >
                ಕನ್ನಡ
              </button>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark nav-cta-wa"
            >
              <WhatsappLogo weight="fill" className="wa-icon" />
              <span className="wa-text">{t('nav.whatsapp')}</span>
              <span className="arrow">↗</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Slide-down Navigation Panel */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-links">
            <a href="#why" onClick={handleLinkClick}>
              {t('nav.why')}
            </a>
            <a href="#journey" onClick={handleLinkClick}>
              {t('nav.howItWorks')}
            </a>
            <a href="#results" onClick={handleLinkClick}>
              {t('nav.results')}
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark mobile-drawer-cta"
              onClick={handleLinkClick}
            >
              <WhatsappLogo weight="fill" className="wa-icon" />
              <span>{t('nav.whatsapp')}</span>
              <span className="arrow">↗</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
