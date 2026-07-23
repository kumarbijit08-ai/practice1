import React from 'react';
import { useWeb } from '../context/WebContext';
import { Trophy, Calendar, Award, Star, Sparkles } from 'lucide-react';

export default function Achievements({ theme }: { theme: 'light' | 'dark' }) {
  const { data } = useWeb();

  return (
    <section
      id="achievements"
      className={`py-24 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            id="achievements-section-heading"
            className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-2"
          >
            Accomplishments
          </h2>
          <p
            id="achievements-section-sub"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent"
          >
            Milestones of Educational Excellence
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-indigo-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Timeline Layout */}
        <div id="achievements-timeline-container" className="relative max-w-4xl mx-auto pl-8 sm:pl-0">
          
          {/* Vertical axis line (center-aligned on desktop, left-aligned on mobile) */}
          <div className="absolute left-[15px] sm:left-1/2 top-0 bottom-0 w-0.5 bg-neutral-300 dark:bg-neutral-800 -translate-x-1/2" />

          <div className="space-y-12 relative">
            {data.achievements.map((ach, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={ach.id}
                  id={`achievement-node-${ach.id}`}
                  className={`flex flex-col sm:flex-row items-start sm:items-center relative ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Outer Orbit Point (Target Dot) */}
                  <div className="absolute left-[-26px] sm:left-1/2 w-6 h-6 rounded-full bg-neutral-950 border-2 border-indigo-500 -translate-x-1/2 flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  </div>

                  {/* Card item box */}
                  <div className="w-full sm:w-[46%]">
                    <div
                      className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.02] shadow-md group ${
                        theme === 'dark'
                          ? 'bg-neutral-900 border-neutral-800 hover:border-indigo-500/30'
                          : 'bg-white border-neutral-200 hover:border-indigo-500/25 hover:shadow-lg shadow-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-4">
                        <Calendar className="w-4 h-4 text-sky-400" />
                        <span className="text-xs font-black uppercase tracking-widest bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full">
                          {ach.year}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400`}>
                          {ach.category || "Honors"}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold tracking-tight mb-2.5 group-hover:text-indigo-400 transition-colors duration-200">
                        {ach.title}
                      </h3>
                      
                      <p className={`text-sm leading-relaxed ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                      }`}>
                        {ach.description}
                      </p>
                    </div>
                  </div>

                  {/* Empty balance spacer for alignment */}
                  <div className="hidden sm:block w-[46%]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials / Outcomes Integration */}
        <div id="student-learning-outcomes" className="mt-24 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold tracking-tight">Our Key Student Success Metric</h3>
            <p className={`text-sm mt-1.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Beyond technology certificates, we focus on nurturing holistic cognitive thinking habits:
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: 'Critical Problem Solving', rating: '98%' },
              { title: 'Design & Creative Engineering', rating: '94%' },
              { title: 'Collaboration & Leadership', rating: '92%' },
              { title: 'National Science Expositions', rating: '35+ Entries' },
              { title: 'Active Coding Proficiency', rating: '88%' },
              { title: 'Practical Hands-on Projects', rating: '100%' }
            ].map((metric, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border text-center relative overflow-hidden group ${
                  theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
                }`}
              >
                <h4 className="text-2xl font-black bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
                  {metric.rating}
                </h4>
                <p className={`text-xs font-bold tracking-wide mt-1.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {metric.title}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
