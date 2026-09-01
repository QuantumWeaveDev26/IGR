import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const AudienceSection: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);

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
          <div className="eyebrow">06 / Built for academic excellence</div>
          <div>
            <h2>For every family looking beyond tuition.</h2>
          </div>
        </div>
        <div className="audience-grid" ref={gridRef}>
          <div className="audience-card">
            <b>Parents</b>
            <p>Who want learning to feel more personal, not more pressurised.</p>
          </div>
          <div className="audience-card">
            <b>Struggling learners</b>
            <p>Who need concepts rebuilt with patience and clarity.</p>
          </div>
          <div className="audience-card">
            <b>High performers</b>
            <p>Who are ready to go further than the standard route.</p>
          </div>
          <div className="audience-card">
            <b>Schools</b>
            <p>Preparing learners for a changing, AI-driven future.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
