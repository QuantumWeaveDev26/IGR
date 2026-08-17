import React, { useState } from 'react';
import { ChartLineUp, Clock, Brain, ShieldCheck, Sparkle, ArrowUpRight, CheckCircle, BellRinging } from '@phosphor-icons/react';

export const ParentDashboardPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'diagnostic' | 'screentime' | 'predictor'>('weekly');

  return (
    <section className="py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-semibold uppercase tracking-widest">
            <ChartLineUp weight="fill" className="w-4 h-4 text-blue-600" />
            <span>PARENT DASHBOARD PREVIEW</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-serif">
            Total Academic Transparency
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            No more guessing how study hours are spent. Track concept diagnostics, screen efficiency, and mark velocity in real time.
          </p>
        </div>

        {/* Doppelrand UI Mockup Container */}
        <div className="doppelrand-outer shadow-2xl max-w-6xl mx-auto">
          <div className="doppelrand-inner bg-[#FAF9F6] border border-slate-200/90 rounded-2xl p-6 sm:p-10">

            {/* Dashboard Header Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  📊
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-serif">Aarav's Learning Portal</h3>
                  <p className="text-xs text-slate-500 font-mono">CBSE Class 10 • Roll #48 • Updated 5 mins ago</p>
                </div>
              </div>

              {/* Interactive Dashboard Tabs (Squircle, NO Pills) */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('weekly')}
                  className={`py-2 px-3.5 rounded-lg text-xs font-semibold font-mono transition-all border ${
                    activeTab === 'weekly'
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  📈 Weekly Velocity
                </button>

                <button
                  onClick={() => setActiveTab('diagnostic')}
                  className={`py-2 px-3.5 rounded-lg text-xs font-semibold font-mono transition-all border ${
                    activeTab === 'diagnostic'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  🧬 Diagnostic Map
                </button>

                <button
                  onClick={() => setActiveTab('screentime')}
                  className={`py-2 px-3.5 rounded-lg text-xs font-semibold font-mono transition-all border ${
                    activeTab === 'screentime'
                      ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  ⏱️ Screen Time
                </button>

                <button
                  onClick={() => setActiveTab('predictor')}
                  className={`py-2 px-3.5 rounded-lg text-xs font-semibold font-mono transition-all border ${
                    activeTab === 'predictor'
                      ? 'bg-slate-900 text-white border-slate-800 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  🎯 CBSE Score Predictor
                </button>
              </div>
            </div>

            {/* Tab 1: Weekly Velocity */}
            {activeTab === 'weekly' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-slate-900">Academic Score Velocity (Last 4 Weeks)</span>
                    <span className="text-emerald-600 font-bold">+38% Overall Improvement</span>
                  </div>

                  {/* SVG Vector Performance Chart */}
                  <div className="h-48 w-full relative flex items-end pt-6 pb-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120">
                      <path
                        d="M 0 100 Q 100 80 200 45 T 400 15"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 0 100 Q 100 80 200 45 T 400 15 L 400 120 L 0 120 Z"
                        fill="url(#blue-gradient)"
                        opacity="0.15"
                      />
                      <defs>
                        <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563EB" />
                          <stop offset="100%" stopColor="#FAF9F6" />
                        </linearGradient>
                      </defs>

                      {/* Points */}
                      <circle cx="0" cy="100" r="5" fill="#2563EB" />
                      <circle cx="133" cy="70" r="5" fill="#2563EB" />
                      <circle cx="266" cy="35" r="5" fill="#2563EB" />
                      <circle cx="400" cy="15" r="6" fill="#059669" />
                    </svg>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400 font-mono border-t border-slate-100 pt-3">
                    <span>Week 1 (Diagnostic: 58%)</span>
                    <span>Week 2 (68%)</span>
                    <span>Week 3 (79%)</span>
                    <span className="text-emerald-600 font-bold">Week 4 (96%)</span>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4 text-left">
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>Physics: Electricity & Magnetism</span>
                      <span className="text-emerald-600 font-mono">94% Mastered</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-md overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[94%]" />
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>Mathematics: Trigonometric Ratios</span>
                      <span className="text-blue-600 font-mono">91% Mastered</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-md overflow-hidden">
                      <div className="bg-blue-600 h-full w-[91%]" />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                      <BellRinging weight="fill" className="w-4 h-4 text-blue-600" />
                      <span>APPU Parent Insight</span>
                    </div>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      "Aarav mastered Quadratic Equations in 35 minutes today! Screen time reduced by 25 minutes while retention increased by 40%."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Diagnostic Concept Map */}
            {activeTab === 'diagnostic' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in text-left">
                <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">✓</div>
                  <h4 className="font-bold text-slate-900 text-sm">Strong Concepts (Zero Doubt)</h4>
                  <p className="text-xs text-slate-600">Light Reflection, Real Numbers, Polynomials, Chemical Reactions.</p>
                </div>

                <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">⚡</div>
                  <h4 className="font-bold text-slate-900 text-sm">In Progress (Active APPU Practice)</h4>
                  <p className="text-xs text-slate-600">Triangles Similarity, Metals & Non-Metals, Linear Equations.</p>
                </div>

                <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">🎯</div>
                  <h4 className="font-bold text-slate-900 text-sm">Upcoming Milestone</h4>
                  <p className="text-xs text-slate-600">Coordinate Geometry & Carbon Compounds story module.</p>
                </div>
              </div>
            )}

            {/* Tab 3: Screen Time Optimizer */}
            {activeTab === 'screentime' && (
              <div className="p-6 bg-white border border-slate-200 rounded-2xl text-left space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Screen Time Efficiency Ratio</span>
                  <span className="text-emerald-600 font-mono font-bold">45 Mins Focus = 3 Hours Tuition Equivalent</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-mono uppercase">Traditional Tuition</span>
                    <span className="text-2xl font-bold text-slate-900 block mt-1">2.5 Hours / Day</span>
                    <span className="text-xs text-rose-500 font-semibold">High Fatigue, Low Retention</span>
                  </div>

                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
                    <span className="text-xs text-emerald-800 font-mono uppercase">IGr Adaptive Micro-Sessions</span>
                    <span className="text-2xl font-bold text-emerald-700 block mt-1">45 Mins / Day</span>
                    <span className="text-xs text-emerald-600 font-semibold">Zero Fatigue, 90%+ Retention</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: CBSE Mark Predictor */}
            {activeTab === 'predictor' && (
              <div className="p-6 bg-slate-900 text-white rounded-2xl text-left space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
                  <span className="text-slate-400">Target Board Exam: CBSE Class 10</span>
                  <span className="text-emerald-400 font-bold">Confidence Score: 94%</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 text-center">
                    <span className="text-xs text-slate-400 uppercase font-mono">Previous Average</span>
                    <span className="text-3xl font-extrabold text-slate-300 block mt-1">64%</span>
                  </div>

                  <div className="p-4 bg-blue-950 border border-blue-800 rounded-xl text-center">
                    <span className="text-xs text-blue-300 uppercase font-mono">Current IGr Track</span>
                    <span className="text-3xl font-extrabold text-blue-400 block mt-1">92%</span>
                  </div>

                  <div className="p-4 bg-emerald-950 border border-emerald-800 rounded-xl text-center">
                    <span className="text-xs text-emerald-300 uppercase font-mono font-bold">Projected Boost</span>
                    <span className="text-3xl font-extrabold text-emerald-400 block mt-1">+28 Marks</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};
