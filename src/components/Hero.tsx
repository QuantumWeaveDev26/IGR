import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { animate, stagger } from 'animejs';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onOpenEarlyAccess: () => void;
  onOpenVideoModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEarlyAccess }) => {
  const heroRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero .eyebrow, .hero h1, .hero-copy, .hero .cta-row', {
        y: 35,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out'
      });

      gsap.from('.hero .proof div', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        delay: 0.4,
        ease: 'power2.out'
      });

      gsap.from('#learning-map', {
        scale: 0.82,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'back.out(1.4)'
      });
    }, heroRef);

    animate('.hero .spark', {
      translateY: [-6, 8],
      rotate: [-8, 12],
      alternate: true,
      loop: true,
      ease: 'inOutSine',
      duration: 2400,
      delay: stagger(300)
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="wrap hero-grid">
        <div>
          <div className="eyebrow">{t('hero.eyebrow')}</div>
          <h1>
            {t('hero.headline1')}
            <br />
            <em>{t('hero.headline2')}</em> {t('hero.headline3')}
          </h1>
          <p className="hero-copy">
            {t('hero.copy')}
          </p>
          <div className="cta-row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenEarlyAccess}
            >
              {t('hero.cta.primary')} <span className="arrow">↗</span>
            </button>
            <a className="btn" href="#journey">
              {t('hero.cta.secondary')} <span className="arrow">↓</span>
            </a>
          </div>
          <div className="proof">
            <div>
              <b>{t('hero.proof.appu.label')}</b>{t('hero.proof.appu.text')}
            </div>
            <div>
              <b>{t('hero.proof.hours.label')}</b>{t('hero.proof.hours.text')}
            </div>
            <div>
              <b>{t('hero.proof.ai.label')}</b>{t('hero.proof.ai.text')}
            </div>
          </div>
        </div>

        <div
          ref={mapRef}
          className="map route-a"
          id="learning-map"
          aria-label="Visual learning map"
        >
          <div className="orbit-word w1">{t('hero.orbit.w1')}</div>
          <div className="orbit-word w2">{t('hero.orbit.w2')}</div>
          <div className="orbit-word w3">{t('hero.orbit.w3')}</div>

          <div className="route r1" />
          <div className="route r2" />
          <div className="route r3" />

          <div className="note n1">
            <span className="eyebrow">{t('hero.route.r1.eyebrow')}</span>
            <strong>{t('hero.route.r1.title')}</strong>{t('hero.route.r1.desc')}
          </div>
          <div className="note n2">
            <span className="eyebrow">{t('hero.route.r2.eyebrow')}</span>
            <strong>{t('hero.route.r2.title')}</strong>{t('hero.route.r2.desc')}
          </div>
          <div className="note n3">
            <span className="eyebrow">{t('hero.route.r3.eyebrow')}</span>
            <strong>{t('hero.route.r3.title')}</strong>{t('hero.route.r3.desc')}
          </div>

          <div
            className="appu"
            aria-label="APPU mascot character"
          >
            <span className="spark sp1">✦</span>
            <span className="spark sp2">✳</span>
            <span className="spark sp3">•</span>
            <div className="head">
              <i className="eye e1" />
              <i className="eye e2" />
              <i className="smile" />
            </div>
            <div className="body">
              <div className="badge">I</div>
            </div>
            <i className="leg l1" />
            <i className="leg l2" />
          </div>
        </div>
      </div>
    </section>
  );
};
