import React from 'react';
import { CheckCircle } from '@phosphor-icons/react';

export const ProductIntro: React.FC = () => {
  return (
    <section className="min-h-screen py-16 sm:py-20 bg-white relative overflow-hidden flex flex-col justify-center border-t border-[#E2DFD8]" id="meet-igr">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Visual Card */}
          <div className="lg:col-span-6">
            <div className="doppelrand-outer luxury-shadow-lg p-2 bg-[#FAF8F5]">
              <div className="doppelrand-inner overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80"
                  alt="Personalized AI Education"
                  className="w-full h-[380px] sm:h-[440px] object-cover object-center filter contrast-105"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Copywriting Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111C1A] tracking-tight font-serif leading-tight">
              Personalized Learning. <br />
              <span className="italic text-[#134340]">Powered by Intelligence.</span>
            </h2>

            <p className="text-[#2D3736] text-base sm:text-lg font-normal leading-relaxed">
              IGr is an advanced personalized learning ecosystem designed for CBSE students. Using intelligent diagnostics, adaptive content, and your private APPU AI Mentor, IGr pinpoints precisely where a student struggles and builds a custom path to mastery.
            </p>

            {/* 3 Core Pillars */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E2DFD8]">
                <CheckCircle weight="fill" className="w-5 h-5 text-[#134340] shrink-0" />
                <span className="text-sm font-semibold text-[#111C1A]">Hyper-Personalized Micro-Diagnostics</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E2DFD8]">
                <CheckCircle weight="fill" className="w-5 h-5 text-[#134340] shrink-0" />
                <span className="text-sm font-semibold text-[#111C1A]">Private APPU AI Learning Studio Mentor</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E2DFD8]">
                <CheckCircle weight="fill" className="w-5 h-5 text-[#134340] shrink-0" />
                <span className="text-sm font-semibold text-[#111C1A]">50% Reduced Screen Time with 2x Output</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
