import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export const AudienceSection: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.audience-card');
    gsap.fromTo(
      cards,
      { y: 35, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%'
        }
      }
    );
  }, []);

  return (
    <section className="audience">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">{t('audience.eyebrow')}</div>
          <div>
            <h2>{t('audience.heading')}</h2>
          </div>
        </div>
        <div className="audience-grid" ref={gridRef}>
          <div className="audience-card">
            <b>{t('audience.card1.title')}</b>
            <p>{t('audience.card1.copy')}</p>
          </div>
          <div className="audience-card">
            <b>{t('audience.card2.title')}</b>
            <p>{t('audience.card2.copy')}</p>
          </div>
          <div className="audience-card">
            <b>{t('audience.card3.title')}</b>
            <p>{t('audience.card3.copy')}</p>
          </div>
          <div className="audience-card">
            <b>{t('audience.card4.title')}</b>
            <p>{t('audience.card4.copy')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
