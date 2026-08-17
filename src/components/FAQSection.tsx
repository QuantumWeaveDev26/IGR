import React, { useState } from 'react';
import { Plus, Minus } from '@phosphor-icons/react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'How does IGr adapt to my child’s specific learning pace?',
    answer: 'IGr’s APPU AI engine conducts continuous micro-diagnostics during every session. Rather than re-teaching entire chapters, it identifies exact foundational gaps down to sub-concepts and adjusts question difficulty and explanation depth in real time.',
  },
  {
    question: 'How is IGr different from traditional tuition or video apps?',
    answer: 'Traditional coaching forces all students through the same batch speed, while video apps encourage 2–3 hours of passive screen watching. IGr requires just 30 minutes of daily active diagnostic practice with zero passive lecture drag.',
  },
  {
    question: 'Is IGr fully aligned with the CBSE curriculum?',
    answer: 'Yes. IGr covers the complete CBSE syllabus for Math, Science, and English across Class 1 to 10, strictly mapped to NCERT standards and exam patterns.',
  },
  {
    question: 'How do parents monitor daily progress?',
    answer: 'Parents get access to a real-time Parent Analytics Dashboard and automated daily WhatsApp summaries showing exact concept mastery, speed, accuracy, and identified strengths.',
  },
  {
    question: 'What happens during the FREE Discovery Call?',
    answer: 'Our senior academic counselor evaluates your child’s current grade, learning preferences, and subject goals, demonstrating a live APPU AI diagnostic session tailored specifically to them.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-14 sm:py-20 bg-[#FAF8F5] relative overflow-hidden border-t border-[#E2DFD8]" id="faq">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

        {/* Section Header - Editorial Style matching Reference Image */}
        <div className="mb-10 sm:mb-14 text-left">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111C1A] tracking-tight font-serif uppercase">
            FAQ.
          </h2>
          <p className="mt-2 text-[#5C6E6B] text-sm sm:text-base font-normal">
            Frequently asked questions by CBSE parents.
          </p>
        </div>

        {/* Hairline Accordion List */}
        <div className="border-t border-[#E2DFD8] divide-y divide-[#E2DFD8]">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-5 sm:py-6 transition-colors">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between text-left gap-4 group focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg lg:text-xl font-bold text-[#111C1A] font-serif group-hover:text-[#134340] transition-colors leading-snug">
                    {item.question}
                  </span>

                  <div className="w-8 h-8 rounded-full border border-[#E2DFD8] bg-white flex items-center justify-center text-[#111C1A] group-hover:border-[#134340] group-hover:text-[#134340] shrink-0 transition-all">
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-[#134340]" />
                    ) : (
                      <Plus className="w-4 h-4 text-[#111C1A]" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-3 pr-8 sm:pr-12 animate-fade-in">
                    <p className="text-xs sm:text-sm text-[#2D3736] leading-relaxed font-normal max-w-3xl">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
