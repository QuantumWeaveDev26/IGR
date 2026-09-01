import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, stagger } from 'animejs';

gsap.registerPlugin(ScrollTrigger);

export const ManifestoSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const voicesRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Text-wise slide up
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%'
            }
          }
        );
      }

      if (leadRef.current) {
        gsap.fromTo(
          leadRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: leadRef.current,
              start: 'top 85%'
            }
          }
        );
      }

      // Anime.js Stagger on voice pills
      if (voicesRef.current) {
        const spans = voicesRef.current.querySelectorAll('span');
        animate(spans, {
          translateY: [20, 0],
          opacity: [0, 1],
          delay: stagger(120),
          duration: 700,
          ease: 'outBack'
        });
      }

      // Track line reveal
      if (trackRef.current) {
        gsap.fromTo(
          trackRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: trackRef.current,
              start: 'top 90%'
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="why" className="manifesto" ref={sectionRef}>
      <div className="wrap">
        <div className="manifesto-grid">
          <div className="eyebrow">01 / The starting point</div>
          <div>
            <h2 ref={headingRef}>
              Your child isn’t average.
              <br />
              <i>Why should their learning be?</i>
            </h2>
            <p className="lead" ref={leadRef}>
              Some need a picture. Some need a story. Some need to try it first. Some simply need another explanation, at their own pace.
            </p>
            <div className="voices" ref={voicesRef}>
              <span>“Show me.”</span>
              <span>“Tell me.”</span>
              <span>“Let me try.”</span>
              <span>“Give me time.”</span>
            </div>
          </div>
        </div>

        <div className="one-route">
          <div className="route-label">The usual route</div>
          <div className="track" ref={trackRef}>
            <span />
            <span />
            <span />
            <span />
            <span />
            <b>One path for every learner</b>
          </div>
          <div className="route-note">
            When every learner is given the same route, confidence drops. Interest disappears. IGr changes that.
          </div>
        </div>
      </div>
    </section>
  );
};
