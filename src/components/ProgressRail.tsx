import React, { useEffect, useState } from 'react';

export const ProgressRail: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        setProgress(window.scrollY / maxScroll);
      } else {
        setProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="progress-rail" aria-hidden="true">
      <i style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
};
