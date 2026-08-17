import React from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';

interface BoldPromiseProps {
  onOpenEarlyAccess: () => void;
}

export const BoldPromise: React.FC<BoldPromiseProps> = ({ onOpenEarlyAccess }) => {
  return (
    <section className="min-h-screen py-10 lg:py-14 bg-[#FAF8F5] relative overflow-hidden flex flex-col justify-center border-t border-[#E2DFD8]" id="bold-promise">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

        <div className="doppelrand-outer max-w-4xl mx-auto luxury-shadow-lg">
          <div className="doppelrand-inner p-8 sm:p-14 bg-[#134340] text-white text-center space-y-6 rounded-2xl">

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-serif max-w-3xl mx-auto leading-tight">
              30–50% Score Velocity Boost <br />
              <span className="italic text-[#E2E0C8]">Or You Don't Pay.</span>
            </h2>

            <p className="text-[#E2E0C8] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal opacity-95">
              We are so confident in the APPU AI diagnostic methodology that if your child completes 40 hours of learning and does not show measurable score improvement, you receive a full refund.
            </p>

            <div className="pt-4 flex justify-center">
              <button
                onClick={onOpenEarlyAccess}
                className="btn-architectural-primary text-base py-4 px-8 shadow-xl bg-white text-[#134340] hover:bg-[#FAF8F5]"
              >
                <span>Book Your FREE Discovery Call</span>
                <div className="w-6 h-6 rounded-md bg-[#134340]/10 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-[#134340]" />
                </div>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
