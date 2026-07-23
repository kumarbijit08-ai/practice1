import React, { useState } from 'react';
import { useWeb, ProgramItem } from '../context/WebContext';
import { BookOpen, Calendar, Users, Star, GraduationCap, X, CheckCircle2 } from 'lucide-react';

export default function Programs({ theme }: { theme: 'light' | 'dark' }) {
  const { data } = useWeb();
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null);

  return (
    <section
      id="programs"
      className={`py-24 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            id="programs-section-heading"
            className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-2"
          >
            Learning Paths
          </h2>
          <p
            id="programs-section-sub"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent"
          >
            Structured STEM & Future-Tech Curriculums
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-indigo-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Programs Grid */}
        <div id="programs-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.programs.map((program) => (
            <div
              key={program.id}
              id={`program-card-${program.id}`}
              className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:translate-y-[-6px] hover:shadow-xl ${
                theme === 'dark'
                  ? 'bg-neutral-900/60 border-neutral-800 hover:border-sky-500/30 shadow-sky-500/5'
                  : 'bg-white border-neutral-200 hover:border-sky-500/20 shadow-neutral-100'
              }`}
            >
              <div>
                {/* Program Card Header (Image placeholder) */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-neutral-950/20 z-10 group-hover:bg-transparent transition-colors duration-300" />
                  <img
                    id={`program-img-${program.id}`}
                    src={program.imageUrl}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest bg-sky-500 text-white uppercase">
                    {program.category}
                  </span>
                </div>

                {/* Program Card Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold tracking-tight group-hover:text-sky-400 transition-colors duration-200">
                    {program.title}
                  </h3>
                  <p className={`text-sm leading-relaxed line-clamp-3 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                  }`}>
                    {program.description}
                  </p>
                </div>
              </div>

              {/* Program Card Footer */}
              <div className="p-6 pt-0 flex items-center justify-between border-t border-dashed mt-4 border-neutral-800">
                <div className="flex items-center gap-1 text-xs font-semibold text-neutral-400">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <span>{program.duration.split(' ')[0]} {program.duration.split(' ')[1] || 'Duration'}</span>
                </div>
                <button
                  id={`program-more-btn-${program.id}`}
                  onClick={() => setSelectedProgram(program)}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 transition-all duration-200 cursor-pointer"
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Detail Lightbox Modal */}
      {selectedProgram && (
        <div id="program-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedProgram(null)} />
          <div
            id="program-modal-content"
            className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border shadow-2xl transition-colors duration-200 ${
              theme === 'dark' ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            <button
              id="close-program-modal-btn"
              onClick={() => setSelectedProgram(null)}
              className={`absolute top-4 right-4 p-2 rounded-full z-20 ${
                theme === 'dark' ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row gap-6 items-start pb-6 border-b border-neutral-800/20">
              <img
                src={selectedProgram.imageUrl}
                alt={selectedProgram.title}
                className="w-full sm:w-44 h-32 object-cover rounded-2xl border border-neutral-800"
              />
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-sky-500 text-white uppercase tracking-widest">
                  {selectedProgram.category}
                </span>
                <h3 className="text-2xl font-black bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
                  {selectedProgram.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sky-400" />
                    <span>{selectedProgram.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>Audience: {selectedProgram.eligibility}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 pt-6">
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-sky-400">Course Overview</h4>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-600'}`}>
                  {selectedProgram.longDescription || selectedProgram.description}
                </p>
              </div>

              {/* Outcomes and Modules side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Outcomes */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    <span>Learning Outcomes</span>
                  </h4>
                  <ul className="space-y-2">
                    {selectedProgram.outcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-medium text-neutral-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Modules */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>Syllabus Modules</span>
                  </h4>
                  <ul className="space-y-2">
                    {selectedProgram.modules.map((mod, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-medium text-neutral-400">
                        <span className="text-sky-500 font-bold">•</span>
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
