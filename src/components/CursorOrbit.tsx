import React, { useEffect, useRef, useState } from 'react';

export const CursorOrbit: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    const isFine = window.matchMedia('(pointer: fine)').matches;
    setIsFinePointer(isFine);

    if (!isFine) return;

    // High performance direct DOM mutation without triggering React re-renders on mousemove
    const handlePointerMove = (e: PointerEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handlePointerEnter = () => setIsActive(true);
    const handlePointerLeave = () => setIsActive(false);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const attachHoverListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, .station, .profile, .result-note, .audience-card');
      interactiveElements.forEach((el) => {
        el.addEventListener('pointerenter', handlePointerEnter);
        el.addEventListener('pointerleave', handlePointerLeave);
      });
    };

    attachHoverListeners();
    const timeout = setTimeout(attachHoverListeners, 500);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('pointermove', handlePointerMove);
      const interactiveElements = document.querySelectorAll('a, button, .station, .profile, .result-note, .audience-card');
      interactiveElements.forEach((el) => {
        el.removeEventListener('pointerenter', handlePointerEnter);
        el.removeEventListener('pointerleave', handlePointerLeave);
      });
    };
  }, []);

  if (!isFinePointer) return null;

  return (
    <div
      ref={cursorRef}
      className={`cursor-orbit ${isActive ? 'is-active' : ''}`}
      aria-hidden="true"
    />
  );
};
