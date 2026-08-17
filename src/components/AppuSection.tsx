import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { animate } from 'animejs';

export const AppuSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

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
          <div className="eyebrow">02 / Meet IGr</div>
          <h2>A complete learning system that adapts to your child.</h2>
          <p>
            Academic excellence through AI-powered hyper-personalized learning. IGr makes room for how each learner understands—not just what they need to finish.
          </p>
          <div className="statements">
            <div className="statement">
              <span>Not another tuition.</span>
              <span>×</span>
            </div>
            <div className="statement">
              <span>Not another recorded course.</span>
              <span>×</span>
            </div>
            <div className="statement">
              <span>Not another learning app.</span>
              <span>×</span>
            </div>
          </div>
        </div>

        <aside className="appu-card">
          <div className="eyebrow">Your child’s guide</div>
          <h3>Learn with APPU.</h3>
          <p>A mentor designed to make learning engaging, memorable and less intimidating.</p>
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

