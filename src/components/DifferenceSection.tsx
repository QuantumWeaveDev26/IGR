import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export const DifferenceSection: React.FC = () => {
  const compareRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
  }, [t]);

  return (
    <section className="difference">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">{t.differenceSection.eyebrow}</div>
          <div>
            <h2>{t.differenceSection.title}</h2>
            <p>{t.differenceSection.description}</p>
          </div>
        </div>
        <div className="compare" ref={compareRef}>
          <div className="compare-row compare-head">
            <div>{t.differenceSection.colTraditional}</div>
            <div>{t.differenceSection.colIgr}</div>
          </div>
          <div className="compare-row">
            <div>{t.differenceSection.row1Trad}</div>
            <div>{t.differenceSection.row1Igr}</div>
          </div>
          <div className="compare-row">
            <div>{t.differenceSection.row2Trad}</div>
            <div>{t.differenceSection.row2Igr}</div>
          </div>
          <div className="compare-row">
            <div>{t.differenceSection.row3Trad}</div>
            <div>{t.differenceSection.row3Igr}</div>
          </div>
          <div className="compare-row">
            <div>{t.differenceSection.row4Trad}</div>
            <div>{t.differenceSection.row4Igr}</div>
          </div>
          <div className="compare-row">
            <div>{t.differenceSection.row5Trad}</div>
            <div>{t.differenceSection.row5Igr}</div>
          </div>
          <div className="compare-row">
            <div>{t.differenceSection.row6Trad}</div>
            <div>{t.differenceSection.row6Igr}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ComparisonTable = DifferenceSection;
