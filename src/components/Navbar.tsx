import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { WhatsappLogo } from '@phosphor-icons/react';

interface NavbarProps {
  onOpenEarlyAccess?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const navRef = useRef<HTMLElement>(null);
  const waUrl = "https://wa.me/919740595677?text=Hi%20IGr%2C%20I%20would%20like%20to%20know%20more%20about%20APPU%20for%20CBSE%20learning.";

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <div className="wrap">
      <nav ref={navRef}>
        <div className="brand">
          IGr
          <small>Instaskills Gamechanger</small>
        </div>
        <div className="nav-links">
          <a href="#why">Why IGr</a>
          <a href="#journey">How it works</a>
          <a href="#results">Results</a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark !bg-emerald-700 !border-emerald-700 hover:!bg-emerald-800 text-white flex items-center gap-2"
          >
            <WhatsappLogo weight="fill" className="w-5 h-5 text-emerald-300" />
            <span>Whatsapp Us</span>
            <span className="arrow">↗</span>
          </a>
        </div>
      </nav>
    </div>
  );
};
