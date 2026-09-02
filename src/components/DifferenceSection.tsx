import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export const DifferenceSection: React.FC = () => {
  const compareRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!compareRef.current) return;

    const rows = compareRef.current.querySelectorAll('.compare-row:not(.compare-head)');
    gsap.fromTo(
      rows,
      { y: 25, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: compareRef.current,
          start: 'top 80%'
        }
      }
    );
  }, []);

  return (
    <section className="difference">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">{t('diff.eyebrow')}</div>
          <div>
            <h2>{t('diff.heading')}</h2>
            <p>{t('diff.copy')}</p>
          </div>
        </div>
        <div className="compare" ref={compareRef}>
          <div className="compare-row compare-head">
            <div>{t('diff.head.traditional')}</div>
            <div>{t('diff.head.igr')}</div>
          </div>
          <div className="compare-row">
            <div>{t('diff.row1.old')}</div>
            <div>{t('diff.row1.new')}</div>
          </div>
          <div className="compare-row">
            <div>{t('diff.row2.old')}</div>
            <div>{t('diff.row2.new')}</div>
          </div>
          <div className="compare-row">
            <div>{t('diff.row3.old')}</div>
            <div>{t('diff.row3.new')}</div>
          </div>
          <div className="compare-row">
            <div>{t('diff.row4.old')}</div>
            <div>{t('diff.row4.new')}</div>
          </div>
          <div className="compare-row">
            <div>{t('diff.row5.old')}</div>
            <div>{t('diff.row5.new')}</div>
          </div>
          <div className="compare-row">
            <div>{t('diff.row6.old')}</div>
            <div>{t('diff.row6.new')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ComparisonTable = DifferenceSection;
