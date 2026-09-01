import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export const RouteSection: React.FC = () => {
  const [activeStation, setActiveStation] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const atlasRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const stations = t.routeSection.stations.map((st, i) => ({
    ...st,
    class: `s${i + 1}`
  }));

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
  }, [t]);

  return (
    <section id="journey" className="route-section" ref={sectionRef}>
      <div className="wrap">
        <div className="route-title">
          <div>
            <div className="eyebrow">{t.routeSection.eyebrow}</div>
            <h2>
              {t.routeSection.titleLine1}
              <br />
              {t.routeSection.titleLine2}
            </h2>
          </div>
          <p>{t.routeSection.description}</p>
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
              <h3>{st.title}</h3>
              <p>{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
