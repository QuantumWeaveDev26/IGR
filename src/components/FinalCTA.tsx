import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WhatsappLogo } from '@phosphor-icons/react';

gsap.registerPlugin(ScrollTrigger);

interface FinalCTAProps {
  onOpenEarlyAccess: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenEarlyAccess }) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const waUrl = "https://wa.me/919740595677?text=Hi%20IGr%2C%20I%20would%20like%20to%20know%20more%20about%20APPU%20for%20CBSE%20learning.";

  useEffect(() => {
    if (!mainRef.current) return;

    gsap.fromTo(
      mainRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: mainRef.current,
          start: 'top 85%'
        }
      }
    );
  }, []);

  return (
    <section id="contact" className="final">
      <div className="wrap">
        <div className="final-main" ref={mainRef}>
          <div className="eyebrow">Start with a conversation</div>
          <h2>
            Give your child the learning journey they <em>deserve.</em>
          </h2>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn !bg-emerald-600 !border-emerald-600 text-white hover:!bg-emerald-700 flex items-center gap-2"
            >
              <WhatsappLogo weight="fill" className="w-5 h-5 text-emerald-200" />
              <span>Whatsapp Us</span>
              <span className="arrow">↗</span>
            </a>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenEarlyAccess}
              aria-label="Book a free discovery call"
            >
              Book your free discovery call <span className="arrow">↗</span>
            </button>
          </div>
        </div>
        <footer className="footer">
          <span>
            Learning that adapts to every learner. Powered by AI. Driven by hyper-personalization. Built for academic excellence.
          </span>
          <span>© IGr / Instaskills Gamechanger</span>
        </footer>
      </div>
    </section>
  );
};
