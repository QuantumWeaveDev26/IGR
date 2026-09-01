import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export const AudienceSection: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
  }, [t]);

  return (
    <section className="audience">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">{t.audienceSection.eyebrow}</div>
          <div>
            <h2>{t.audienceSection.title}</h2>
          </div>
        </div>
        <div className="audience-grid" ref={gridRef}>
          <div className="audience-card">
            <b>{t.audienceSection.card1Title}</b>
            <p>{t.audienceSection.card1Desc}</p>
          </div>
          <div className="audience-card">
            <b>{t.audienceSection.card2Title}</b>
            <p>{t.audienceSection.card2Desc}</p>
          </div>
          <div className="audience-card">
            <b>{t.audienceSection.card3Title}</b>
            <p>{t.audienceSection.card3Desc}</p>
          </div>
          <div className="audience-card">
            <b>{t.audienceSection.card4Title}</b>
            <p>{t.audienceSection.card4Desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
