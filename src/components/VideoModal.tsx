import React, { useEffect } from 'react';
import { X, FilmStrip } from '@phosphor-icons/react';
import { useTranslation } from '../context/LanguageContext';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-bottom-sheet sm:animate-none">

        {/* Mobile Pull Handle */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 px-4 sm:px-6 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2 text-white font-serif font-bold text-sm sm:text-base">
            <FilmStrip weight="fill" className="w-4 h-4 sm:w-5 sm:h-5 text-[#879D91]" />
            <span className="truncate max-w-[240px] sm:max-w-none">{t.modals.videoTitle}</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-colors touch-active-bounce shrink-0 cursor-pointer"
            aria-label={t.modals.closeLabel}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Video Embed Iframe Container */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src="https://www.youtube.com/embed/EE5yKFzgFJI?autoplay=1&rel=0"
            title="IGr Promo Video"
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 px-4 sm:px-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] sm:text-xs text-slate-400 font-mono">
          <span>{t.modals.videoFooterDemo}</span>
          <span className="hidden sm:inline">YouTube ID: EE5yKFzgFJI</span>
        </div>

      </div>
    </div>
  );
};
