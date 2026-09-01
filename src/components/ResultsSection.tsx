import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ResultsSection: React.FC = () => {
  const listRef = useRef<HTMLDivElement>(null);

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
          <div className="eyebrow">04 / Within the first 40 hours</div>
          <h2>First, they notice the difference.</h2>
          <p className="results-intro">
            The first transformation is not just better marks. It is how a child begins to show up for learning. The marks follow the understanding.
          </p>
        </div>
        <div className="results-list" ref={listRef}>
          <div>
            <span>01</span>
            <p>“They explain the idea in their own words now.”</p>
            <b>Understanding</b>
          </div>
          <div>
            <span>02</span>
            <p>“Homework doesn’t start with resistance anymore.”</p>
            <b>Learning habits</b>
          </div>
          <div>
            <span>03</span>
            <p>“They put their hand up in class.”</p>
            <b>Participation</b>
          </div>
          <div>
            <span>04</span>
            <p>“They are asking questions I haven’t heard before.”</p>
            <b>Curiosity & confidence</b>
          </div>
        </div>
      </div>
    </section>
  );
};
