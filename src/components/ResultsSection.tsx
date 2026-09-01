import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export const ResultsSection: React.FC = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
  }, [t]);

  return (
    <section id="results" className="results">
      <div className="wrap results-grid">
        <div>
          <div className="eyebrow">{t.resultsSection.eyebrow}</div>
          <h2>{t.resultsSection.title}</h2>
          <p className="results-intro">
            {t.resultsSection.intro}
          </p>
        </div>
        <div className="results-list" ref={listRef}>
          <div>
            <span>01</span>
            <p>{t.resultsSection.item1Quote}</p>
            <b>{t.resultsSection.item1Badge}</b>
          </div>
          <div>
            <span>02</span>
            <p>{t.resultsSection.item2Quote}</p>
            <b>{t.resultsSection.item2Badge}</b>
          </div>
          <div>
            <span>03</span>
            <p>{t.resultsSection.item3Quote}</p>
            <b>{t.resultsSection.item3Badge}</b>
          </div>
          <div>
            <span>04</span>
            <p>{t.resultsSection.item4Quote}</p>
            <b>{t.resultsSection.item4Badge}</b>
          </div>
        </div>
      </div>
    </section>
  );
};
