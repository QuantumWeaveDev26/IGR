import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const RouteSection: React.FC = () => {
  const [activeStation, setActiveStation] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const atlasRef = useRef<HTMLDivElement>(null);

  const stations = [
    { id: '01', title: 'Understand', desc: 'Concepts, not answers to memorise.', class: 's1' },
    { id: '02', title: 'Explore', desc: 'Stories, visuals and examples.', class: 's2' },
    { id: '03', title: 'Practise', desc: 'Small challenges that build belief.', class: 's3' },
    { id: '04', title: 'Reflect', desc: 'Learning that stays with them.', class: 's4' },
    { id: '05', title: 'Grow', desc: 'Progress everyone can see.', class: 's5' },
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
            <div className="eyebrow">03 / A route that changes with them</div>
            <h2>
              One learner.
              <br />
              Many ways forward.
            </h2>
          </div>
          <p>Every learning journey draws from the same strong foundation, then adapts to the learner in front of it.</p>
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
