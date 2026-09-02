import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { animate } from 'animejs';
import { useLanguage } from '../context/LanguageContext';

export const AppuSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.appu-section h2, .appu-section p, .statement', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      });

      gsap.from('.appu-card', {
        scrollTrigger: {
          trigger: '.appu-card',
          start: 'top 85%'
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.4)'
      });
    }, sectionRef);

    animate('.mini-appu', {
      translateY: [-4, 6],
      rotate: [-1, 2],
      alternate: true,
      loop: true,
      ease: 'inOutQuad',
      duration: 2200
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="appu-section" ref={sectionRef}>
      <div className="wrap appu-layout">
        <div>
          <div className="eyebrow">{t('appu.eyebrow')}</div>
          <h2>{t('appu.heading')}</h2>
          <p>
            {t('appu.copy')}
          </p>
          <div className="statements">
            <div className="statement">
              <span>{t('appu.stmt1')}</span>
              <span>×</span>
            </div>
            <div className="statement">
              <span>{t('appu.stmt2')}</span>
              <span>×</span>
            </div>
            <div className="statement">
              <span>{t('appu.stmt3')}</span>
              <span>×</span>
            </div>
          </div>
        </div>

        <aside className="appu-card">
          <div className="eyebrow">{t('appu.card.eyebrow')}</div>
          <h3>{t('appu.card.title')}</h3>
          <p>{t('appu.card.copy')}</p>
          <div className="mini-appu">
            <div className="head">
              <i className="eye e1" />
              <i className="eye e2" />
              <i className="smile" />
            </div>
            <div className="body" />
            <div className="flag" />
          </div>
        </aside>
      </div>
    </section>
  );
};
