import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { animate, stagger } from 'animejs';

interface HeroProps {
  onOpenEarlyAccess: () => void;
  onOpenVideoModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEarlyAccess }) => {
  const heroRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero .eyebrow, .hero h1, .hero-copy, .hero .cta-row', {
        y: 35,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out'
      });

      gsap.from('.hero .proof div', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        delay: 0.4,
        ease: 'power2.out'
      });

      gsap.from('#learning-map', {
        scale: 0.82,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'back.out(1.4)'
      });
    }, heroRef);

    animate('.hero .spark', {
      translateY: [-6, 8],
      rotate: [-8, 12],
      alternate: true,
      loop: true,
      ease: 'inOutSine',
      duration: 2400,
      delay: stagger(300)
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="wrap hero-grid">
        <div>
          <div className="eyebrow">CBSE high school · learning, made personal</div>
          <h1>
            Every learner is different.
            <br />
            <em>Why</em> is education the same?
          </h1>
          <p className="hero-copy">
            IGr is a hyper-personalized learning system that adapts to your child’s pace, strengths and way of understanding—so learning can finally feel like it belongs to them.
          </p>
          <div className="cta-row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenEarlyAccess}
            >
              Find your child’s learning route <span className="arrow">↗</span>
            </button>
            <a className="btn" href="#journey">
              Explore IGr <span className="arrow">↓</span>
            </a>
          </div>
          <div className="proof">
            <div>
              <b>With APPU</b>A favourite guide for every learning moment
            </div>
            <div>
              <b>40 hours</b>Build a stronger learning foundation
            </div>
            <div>
              <b>AI-ready</b>Future skills, naturally included
            </div>
          </div>
        </div>

        <div
          ref={mapRef}
          className="map route-a"
          id="learning-map"
          aria-label="Visual learning map"
        >
          <div className="orbit-word w1">curiosity</div>
          <div className="orbit-word w2">clarity</div>
          <div className="orbit-word w3">confidence</div>

          <div className="route r1" />
          <div className="route r2" />
          <div className="route r3" />

          <div className="note n1">
            <span className="eyebrow">Route 01</span>
            <strong>See it</strong>Visual learner
          </div>
          <div className="note n2">
            <span className="eyebrow">Route 02</span>
            <strong>Try it</strong>Learn by doing
          </div>
          <div className="note n3">
            <span className="eyebrow">Route 03</span>
            <strong>Tell it</strong>Learn through stories
          </div>

          <div
            className="appu"
            aria-label="APPU mascot character"
          >
            <span className="spark sp1">✦</span>
            <span className="spark sp2">✳</span>
            <span className="spark sp3">•</span>
            <div className="head">
              <i className="eye e1" />
              <i className="eye e2" />
              <i className="smile" />
            </div>
            <div className="body">
              <div className="badge">I</div>
            </div>
            <i className="leg l1" />
            <i className="leg l2" />
          </div>
        </div>
      </div>
    </section>
  );
};
