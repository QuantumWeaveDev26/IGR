import React from 'react';
import { Check } from '@phosphor-icons/react';

export const TargetAudience: React.FC = () => {
  const cards = [
    {
      role: "CBSE High School Students",
      tag: "Classes 8–12",
      tagColor: "bg-blue-50 text-blue-700 border-blue-200",
      desc: "Master Physics, Chemistry, Mathematics, Biology, and English with personalized AI guidance tailored to official CBSE board standards.",
      icon: "🎯"
    },
    {
      role: "Parents",
      tag: "Full Visibility",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      desc: "Gain transparent, real-time analytics into your child's daily progress, study strengths, and genuine conceptual growth.",
      icon: "📊"
    },
    {
      role: "Schools",
      tag: "Curriculum Integration",
      tagColor: "bg-amber-50 text-amber-700 border-amber-200",
      desc: "Empower teachers with diagnostic data to identify student learning gaps and elevate overall school board exam results.",
      icon: "🏫"
    },
    {
      role: "Educational Institutions",
      tag: "Scale & Quality",
      tagColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      desc: "Deploy a scalable, next-generation AI hyper-personalized learning system across multiple centers and branches.",
      icon: "⚡"
    }
  ];

  return (
    <section className="min-h-screen py-10 lg:py-14 bg-white text-[#111C1A] relative overflow-hidden flex flex-col justify-center border-t border-[#E2DFD8]" id="target-audience">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

        {/* Section Header (NO EYEBROW TAG) */}
        <div className="max-w-3xl mb-10 text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111C1A] tracking-tight font-serif leading-tight">
            Built for the Entire <br />
            <span className="italic text-[#134340]">CBSE Education Ecosystem</span>
          </h2>
        </div>

        {/* 4 Clean Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {cards.map((card, idx) => (
            <div key={idx} className="doppelrand-outer luxury-shadow-md group hover:-translate-y-1 transition-transform">
              <div className="doppelrand-inner p-6 bg-[#FAF8F5] border border-[#E2DFD8] rounded-2xl space-y-4 h-full flex flex-col justify-between">

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E2DFD8] flex items-center justify-center text-lg shadow-2xs group-hover:scale-110 transition-transform">
                      {card.icon}
                    </div>

                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase border ${card.tagColor}`}>
                      {card.tag}
                    </span>
                  </div>

                  <div className="pt-1 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#134340] text-white flex items-center justify-center shrink-0">
                      <Check weight="bold" className="w-2.5 h-2.5 text-white" />
                    </span>
                    <h3 className="text-lg font-bold font-serif text-[#111C1A]">
                      {card.role}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#2D3736] leading-relaxed font-normal opacity-90">
                    {card.desc}
                  </p>
                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
