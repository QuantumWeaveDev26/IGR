import React from 'react';
import { Heart, Target, Rocket, TrendUp, Cpu, Check } from '@phosphor-icons/react';

export const PerfectForSection: React.FC = () => {
  const profiles = [
    {
      icon: Heart,
      iconBg: "bg-blue-50 text-blue-700",
      title: "Parents Wanting More Than Tuition",
      desc: "Families seeking true diagnostic understanding and personalized guidance rather than passive crowded tuition centers."
    },
    {
      icon: Target,
      iconBg: "bg-emerald-50 text-emerald-700",
      title: "Students Struggling with Concepts",
      desc: "Learners who need patience, alternative visual explanations, and zero-judgment doubt resolution."
    },
    {
      icon: Rocket,
      iconBg: "bg-amber-50 text-amber-700",
      title: "High-Performing Students",
      desc: "Curious achievers who want to go further, skip redundant practice, and master advanced subjects at rocket speed."
    },
    {
      icon: TrendUp,
      iconBg: "bg-indigo-50 text-indigo-700",
      title: "Schools Seeking Next-Gen Tech",
      desc: "Forward-thinking educational institutions looking to integrate hyper-personalized AI tools into their CBSE workflow."
    },
    {
      icon: Cpu,
      iconBg: "bg-teal-50 text-teal-700",
      title: "Families Preparing for AI Future",
      desc: "Parents who understand that AI literacy is the single biggest advantage for the next generation of global leaders."
    }
  ];

  return (
    <section className="py-20 bg-white text-[#111C1A] relative overflow-hidden border-t border-[#E2DFD8]" id="perfect-for">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E2DFD8] text-[#134340] text-xs font-mono font-bold tracking-widest uppercase">
            <Target weight="fill" className="w-3.5 h-3.5 text-[#134340]" />
            <span>IDEAL AUDIENCE MATCH</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111C1A] tracking-tight font-serif">
            Perfect For
          </h2>

          <p className="text-[#5C6E6B] text-base leading-relaxed">
            Is IGr right for your household or institution? Discover who benefits most:
          </p>
        </div>

        {/* High-Contrast Editorial Target Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {profiles.map((profile, idx) => {
            const IconComponent = profile.icon;
            return (
              <div key={idx} className="doppelrand-outer luxury-shadow-md">
                <div className="doppelrand-inner p-7 bg-[#FAF8F5] border border-[#E2DFD8] rounded-2xl space-y-4 h-full flex flex-col justify-between">

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${profile.iconBg}`}>
                        <IconComponent weight="bold" className="w-5 h-5" />
                      </div>
                      <span className="w-6 h-6 rounded-full bg-[#134340] text-white flex items-center justify-center">
                        <Check weight="bold" className="w-3.5 h-3.5 text-white" />
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-serif text-[#111C1A]">
                      {profile.title}
                    </h3>

                    <p className="text-sm text-[#2D3736] leading-relaxed font-normal">
                      {profile.desc}
                    </p>
                  </div>

                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};
