import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export const RouteSection: React.FC = () => {
  const [activeStation, setActiveStation] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const atlasRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const stations = [
    { id: '01', titleKey: 'route.s1.title', descKey: 'route.s1.desc', class: 's1' },
    { id: '02', titleKey: 'route.s2.title', descKey: 'route.s2.desc', class: 's2' },
    { id: '03', titleKey: 'route.s3.title', descKey: 'route.s3.desc', class: 's3' },
    { id: '04', titleKey: 'route.s4.title', descKey: 'route.s4.desc', class: 's4' },
    { id: '05', titleKey: 'route.s5.title', descKey: 'route.s5.desc', class: 's5' },
  ];

  useEffect(() => {
    if (!atlasRef.current) return;

    const stationEls = atlasRef.current.querySelectorAll('.station');
    gsap.fromTo(
      stationEls,
      { y: 35, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: atlasRef.current,
          start: 'top 80%'
        }
      }
    );
  }, []);

  return (
    <section id="journey" className="route-section" ref={sectionRef}>
      <div className="wrap">
        <div className="route-title">
          <div>
            <div className="eyebrow">{t('route.eyebrow')}</div>
            <h2>
              {t('route.heading1')}
              <br />
              {t('route.heading2')}
            </h2>
          </div>
          <p>{t('route.copy')}</p>
        </div>

        <div className="route-atlas" ref={atlasRef}>
          <svg viewBox="0 0 1100 370" aria-hidden="true">
            <path
              d="M70 260 C145 75 263 310 351 151 S550 66 642 220 S825 300 1012 96"
              fill="none"
              stroke="#264538"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M70 260 C184 329 215 188 351 151 S505 243 642 220 S880 139 1012 96"
              fill="none"
              stroke="#d95b3f"
              strokeWidth="3"
              strokeDasharray="8 11"
              strokeLinecap="round"
            />
          </svg>

          {stations.map((st, i) => (
            <div
              key={st.id}
              className={`station ${st.class} ${activeStation === i ? 'is-active' : ''}`}
              tabIndex={0}
              role="button"
              aria-label={`Learning journey step ${i + 1}`}
              onMouseEnter={() => setActiveStation(i)}
              onFocus={() => setActiveStation(i)}
              onClick={() => setActiveStation(i)}
            >
              <b>{st.id}</b>
              <h3>{t(st.titleKey)}</h3>
              <p>{t(st.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
