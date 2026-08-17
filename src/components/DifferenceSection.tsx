import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const DifferenceSection: React.FC = () => {
  const compareRef = useRef<HTMLDivElement>(null);

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
          <div className="eyebrow">05 / The difference</div>
          <div>
            <h2>Learning first. Results follow.</h2>
            <p>IGr replaces a single, fixed path with a learning journey that is personal, active and designed to grow independence.</p>
          </div>
        </div>
        <div className="compare" ref={compareRef}>
          <div className="compare-row compare-head">
            <div>Traditional learning</div>
            <div>IGr</div>
          </div>
          <div className="compare-row">
            <div>One syllabus for everyone</div>
            <div>Personalized learning journey</div>
          </div>
          <div className="compare-row">
            <div>Memorisation</div>
            <div>Concept mastery</div>
          </div>
          <div className="compare-row">
            <div>Passive learning</div>
            <div>Gamified engagement</div>
          </div>
          <div className="compare-row">
            <div>One teaching style</div>
            <div>Adaptive learning</div>
          </div>
          <div className="compare-row">
            <div>Long screen time</div>
            <div>Learn smarter, not longer</div>
          </div>
          <div className="compare-row">
            <div>Limited AI exposure</div>
            <div>AI-ready by default</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ComparisonTable = DifferenceSection;
