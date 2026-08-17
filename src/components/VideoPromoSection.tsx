import React from 'react';
import { Play } from '@phosphor-icons/react';

interface VideoPromoSectionProps {
  onOpenVideoModal: () => void;
}

export const VideoPromoSection: React.FC<VideoPromoSectionProps> = ({ onOpenVideoModal }) => {
  return (
    <section className="py-20 bg-[#134340] text-[#FAF8F5] relative overflow-hidden" id="video-demo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="doppelrand-outer max-w-4xl mx-auto luxury-shadow-lg">
          <div className="doppelrand-inner p-8 sm:p-14 bg-[#0A2624] text-center space-y-6 border border-[#1A5450] rounded-2xl">

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-serif max-w-3xl mx-auto leading-tight">
              See IGr in Action
            </h2>

            <p className="text-[#E2E0C8] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal opacity-95">
              Watch how hyper-personalized learning transforms education, boosts student confidence, and eliminates academic stress in real time.
            </p>

            <div className="pt-4 flex justify-center">
              <button
                onClick={onOpenVideoModal}
                className="group inline-flex items-center gap-4 px-8 py-4 bg-[#FAF8F5] text-[#134340] hover:bg-white rounded-xl font-bold text-base transition-all duration-300 shadow-xl transform hover:-translate-y-1 focus:outline-none"
              >
                <div className="w-10 h-10 rounded-lg bg-[#134340] text-[#E2E0C8] group-hover:scale-105 flex items-center justify-center transition-transform shadow-sm">
                  <Play weight="fill" className="w-5 h-5 ml-0.5" />
                </div>
                <span>Watch the Promo Video</span>
              </button>
            </div>

            <div className="pt-2 text-xs font-mono text-[#E2E0C8]/70">
              HD Overview • 2 Minutes • CBSE Case Studies
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
