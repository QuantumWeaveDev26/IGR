import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, stagger } from 'animejs';
import { useTranslation } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export const ManifestoSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const voicesRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
          <div className="eyebrow">{t.manifesto.eyebrow}</div>
          <div>
            <h2 ref={headingRef}>
              {t.manifesto.titleLine1}
              <br />
              <i>{t.manifesto.titleLine2Italic}</i>
            </h2>
            <p className="lead" ref={leadRef}>
              {t.manifesto.lead}
            </p>
            <div className="voices" ref={voicesRef}>
              <span>{t.manifesto.voiceShowMe}</span>
              <span>{t.manifesto.voiceTellMe}</span>
              <span>{t.manifesto.voiceLetMeTry}</span>
              <span>{t.manifesto.voiceGiveMeTime}</span>
            </div>
          </div>
        </div>

        <div className="one-route">
          <div className="route-label">{t.manifesto.usualRouteLabel}</div>
          <div className="track" ref={trackRef}>
            <span />
            <span />
            <span />
            <span />
            <span />
            <b>{t.manifesto.onePathText}</b>
          </div>
          <div className="route-note">
            {t.manifesto.routeNote}
          </div>
        </div>
      </div>
    </section>
  );
};
