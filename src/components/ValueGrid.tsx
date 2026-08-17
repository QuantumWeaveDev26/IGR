import React from 'react';
import { Lightning, Target, Clock, Cpu } from '@phosphor-icons/react';

const features = [
  {
    icon: Target,
    title: 'Precise Diagnostic',
    desc: 'Identifies exact weak concepts instead of re-teaching entire chapters your child already knows.',
    imgSrc: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=400&q=80',
    imgAlt: 'Diagnostic assessment visualization',
  },
  {
    icon: Lightning,
    title: 'Adaptive Flow',
    desc: 'Adjusts difficulty dynamically so students stay challenged without feeling overwhelmed.',
    imgSrc: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80',
    imgAlt: 'Student learning with adaptive technology',
  },
  {
    icon: Clock,
    title: 'Screen Time Control',
    desc: 'Focused 30-minute high-efficiency sessions deliver double the results of 2-hour video lectures.',
    imgSrc: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
    imgAlt: 'Focused learning session',
  },
  {
    icon: Cpu,
    title: 'AI Literacy',
    desc: 'Teaches students how to leverage AI tools responsibly, preparing them for future technology careers.',
    imgSrc: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80',
    imgAlt: 'Future-ready AI learning',
  },
];

export const ValueGrid: React.FC = () => {
  return (
    <section className="py-14 lg:py-20 bg-[#134340] text-[#FAF8F5] relative overflow-hidden" id="appu-studio">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

        {/* Section Header */}
        <div className="max-w-3xl mb-12 text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-serif leading-tight">
            The APPU AI Learning Studio <br />
            <span className="italic text-[#E2E0C8]">Built for CBSE Excellence</span>
          </h2>
        </div>

        {/* Visual Feature Grid — 2x2 on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="group">
                <div className="doppelrand-outer luxury-shadow-md">
                  <div className="doppelrand-inner bg-[#0A2624] border border-[#1A5450] rounded-2xl overflow-hidden h-full flex flex-col">

                    {/* Image thumbnail */}
                    <div className="w-full h-40 sm:h-48 overflow-hidden relative">
                      <img
                        src={feature.imgSrc}
                        alt={feature.imgAlt}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A2624] via-transparent to-transparent" />
                    </div>

                    {/* Text content */}
                    <div className="p-6 sm:p-7 space-y-3 flex-1 flex flex-col">
                      <div className="w-10 h-10 rounded-xl bg-[#134340] border border-[#1A5450] flex items-center justify-center shrink-0">
                        <Icon weight="fill" className="w-5 h-5 text-[#E2E0C8]" />
                      </div>
                      <h3 className="text-lg font-bold text-white font-serif">{feature.title}</h3>
                      <p className="text-xs sm:text-sm text-[#E2E0C8] leading-relaxed font-normal opacity-90 flex-1">
                        {feature.desc}
                      </p>
                    </div>

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
