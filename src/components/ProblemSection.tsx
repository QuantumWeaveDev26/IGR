import React from 'react';
import { ArrowRight, Sparkle, CheckCircle } from '@phosphor-icons/react';

export const ProblemSection: React.FC = () => {
  return (
    <section className="min-h-screen py-10 lg:py-14 bg-[#FAF8F5] relative overflow-hidden flex flex-col justify-center border-t border-[#E2DFD8]" id="why-igr">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

        {/* Section Header (NO EYEBROW TAG) */}
        <div className="max-w-3xl mb-8 text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111C1A] tracking-tight font-serif leading-tight">
            One-size-fits-all teaching leaves <br className="hidden sm:block" />
            <span className="italic text-[#134340]">students behind or bored.</span>
          </h2>

          <p className="mt-3 text-[#2D3736] text-sm sm:text-base font-normal leading-relaxed">
            When students are forced into one teaching style, confidence drops, interest disappears, and marks suffer.
          </p>
        </div>

        {/* 2-Column Visual Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Left Column: Visual Story Cards */}
          <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">

            {/* Visual Card 1 */}
            <div className="doppelrand-outer luxury-shadow-md">
              <div className="doppelrand-inner p-5 sm:p-6 bg-white border border-[#E2DFD8] rounded-2xl flex flex-col sm:flex-row gap-5 items-center">
                <div className="w-full sm:w-2/5 h-44 rounded-xl overflow-hidden shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80"
                    alt="Student Focused Learning"
                    className="w-full h-full object-cover object-center filter contrast-105"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <h3 className="text-xl font-bold text-[#111C1A] font-serif">
                    Foundation First
                  </h3>
                  <p className="text-xs sm:text-sm text-[#2D3736] leading-relaxed font-normal">
                    When foundational concepts are rushed, small doubts turn into test anxiety. IGr ensures every core topic is mastered before moving forward.
                  </p>
                  <div className="pt-1 text-xs font-semibold text-[#134340] flex items-center gap-1.5">
                    <span>Zero-Pressure Diagnostics</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#134340]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Card 2 */}
            <div className="doppelrand-outer luxury-shadow-md">
              <div className="doppelrand-inner p-5 sm:p-6 bg-white border border-[#E2DFD8] rounded-2xl flex flex-col sm:flex-row gap-5 items-center">
                <div className="w-full sm:w-2/5 h-44 rounded-xl overflow-hidden shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
                    alt="Engaged STEM Exploration"
                    className="w-full h-full object-cover object-center filter contrast-105"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <h3 className="text-xl font-bold text-[#111C1A] font-serif">
                    Unbounded Curiosity
                  </h3>
                  <p className="text-xs sm:text-sm text-[#2D3736] leading-relaxed font-normal">
                    Curious minds shouldn’t wait for batch routines. High-capacity learners accelerate seamlessly into advanced STEM challenges.
                  </p>
                  <div className="pt-1 text-xs font-semibold text-[#134340] flex items-center gap-1.5">
                    <span>Unlimited Acceleration</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#134340]" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Featured Dark APPU AI Highlight Card */}
          <div className="lg:col-span-5 flex">
            <div className="doppelrand-outer luxury-shadow-lg w-full">
              <div className="doppelrand-inner p-7 sm:p-8 bg-[#134340] text-[#FAF8F5] border border-[#1A5450] rounded-2xl space-y-6 h-full flex flex-col justify-between">

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#E2E0C8] uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkle weight="fill" className="w-4 h-4 text-[#E2E0C8]" />
                      <span>THE APPU ADVANTAGE</span>
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#879D91] animate-ping" />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-serif leading-tight">
                    Dynamic Learning Adaptation
                  </h3>

                  <p className="text-xs sm:text-sm text-[#E2E0C8] leading-relaxed font-normal opacity-95">
                    Adapts 100% to your child's exact learning velocity. APPU’s AI diagnostic engine maps concept mastery in real time.
                  </p>

                  <div className="space-y-2.5 pt-2 text-xs font-medium text-[#E2E0C8]">
                    <div className="flex items-center gap-2">
                      <CheckCircle weight="fill" className="w-4 h-4 text-[#879D91] shrink-0" />
                      <span>Personalized APPU AI Mentor</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle weight="fill" className="w-4 h-4 text-[#879D91] shrink-0" />
                      <span>50% Screen Time Reduction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle weight="fill" className="w-4 h-4 text-[#879D91] shrink-0" />
                      <span>Zero-Judgment Doubt Resolution</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1A5450]">
                  <a
                    href="#appu-studio"
                    className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl bg-[#FAF8F5] text-[#134340] hover:bg-white font-bold text-xs transition-all shadow-md group touch-active-bounce min-h-[44px]"
                  >
                    <span>Discover APPU AI Studio</span>
                    <ArrowRight className="w-4 h-4 text-[#134340] group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
