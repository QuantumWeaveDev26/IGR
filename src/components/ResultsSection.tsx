import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export const ResultsSection: React.FC = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!listRef.current) return;

    const rows = listRef.current.querySelectorAll(':scope > div');
    gsap.fromTo(
      rows,
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: listRef.current,
          start: 'top 85%'
        }
      }
    );
  }, []);

  return (
    <section id="results" className="results">
      <div className="wrap results-grid">
        <div>
          <div className="eyebrow">{t('results.eyebrow')}</div>
          <h2>{t('results.heading')}</h2>
          <p className="results-intro">
            {t('results.intro')}
          </p>
        </div>
        <div className="results-list" ref={listRef}>
          <div>
            <span>01</span>
            <p>{t('results.r1.quote')}</p>
            <b>{t('results.r1.label')}</b>
          </div>
          <div>
            <span>02</span>
            <p>{t('results.r2.quote')}</p>
            <b>{t('results.r2.label')}</b>
          </div>
          <div>
            <span>03</span>
            <p>{t('results.r3.quote')}</p>
            <b>{t('results.r3.label')}</b>
          </div>
          <div>
            <span>04</span>
            <p>{t('results.r4.quote')}</p>
            <b>{t('results.r4.label')}</b>
          </div>
        </div>
      </div>
    </section>
  );
};
