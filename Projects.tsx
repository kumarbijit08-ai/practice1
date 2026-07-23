import React, { useState } from 'react';
import { useWeb, ProjectItem } from '../context/WebContext';
import { Cpu, Star, X, CheckSquare, Layers } from 'lucide-react';

export default function Projects({ theme }: { theme: 'light' | 'dark' }) {
  const { data } = useWeb();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Intermediate': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Advanced': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    }
  };

  return (
    <section
      id="projects"
      className={`py-24 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            id="projects-section-heading"
            className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-2"
          >
            Mentored Projects
          </h2>
          <p
            id="projects-section-sub"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent"
          >
            Hands-On Innovations Built By Our Students
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-indigo-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Projects Grid */}
        <div id="projects-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.projects.map((project) => (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:translate-y-[-6px] hover:shadow-xl ${
                theme === 'dark'
                  ? 'bg-neutral-900/60 border-neutral-800 hover:border-sky-500/30 shadow-sky-500/5'
                  : 'bg-white border-neutral-200 hover:border-sky-500/20 shadow-neutral-100'
              }`}
            >
              <div>
                {/* Project Image Panel */}
                <div className="relative h-48 overflow-hidden bg-neutral-950">
                  <div className="absolute inset-0 bg-neutral-950/30 z-10 group-hover:bg-transparent transition-all duration-300" />
                  <img
                    id={`project-img-${project.id}`}
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <span className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${
                    getDifficultyColor(project.difficulty)
                  }`}>
                    {project.difficulty}
                  </span>
                </div>

                {/* Card details */}
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-bold tracking-tight group-hover:text-sky-400 transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className={`text-sm leading-relaxed line-clamp-3 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                  }`}>
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.techUsed.slice(0, 3).map((tech, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                          theme === 'dark' ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techUsed.length > 3 && (
                      <span className="text-[10px] font-bold text-sky-400 self-center px-1">
                        +{project.techUsed.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* View Details button */}
              <div className="p-6 pt-0 mt-4">
                <button
                  id={`project-details-btn-${project.id}`}
                  onClick={() => setSelectedProject(project)}
                  className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-all duration-250 cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                      : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                  }`}
                >
                  View Design Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Lightbox Detail Modal */}
      {selectedProject && (
        <div id="project-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedProject(null)} />
          <div
            id="project-modal-content"
            className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border shadow-2xl transition-colors duration-200 ${
              theme === 'dark' ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            <button
              id="close-project-modal-btn"
              onClick={() => setSelectedProject(null)}
              className={`absolute top-4 right-4 p-2 rounded-full z-20 ${
                theme === 'dark' ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row gap-6 items-start pb-6 border-b border-neutral-800/20">
              <img
                src={selectedProject.imageUrl}
                alt={selectedProject.title}
                className="w-full sm:w-44 h-32 object-cover rounded-2xl border border-neutral-800"
              />
              <div className="space-y-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${
                  getDifficultyColor(selectedProject.difficulty)
                }`}>
                  {selectedProject.difficulty} Level
                </span>
                <h3 className="text-2xl font-black bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
                  {selectedProject.title}
                </h3>
                <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Target: Prototyping & Educational Model Setup
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 pt-6">
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-sky-400">Project Overview</h4>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-600'}`}>
                  {selectedProject.overview || selectedProject.description}
                </p>
              </div>

              {/* Technologies list */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>Hardware & Software Stack</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.techUsed.map((tech, idx) => (
                    <span
                      key={idx}
                      className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                        theme === 'dark'
                          ? 'bg-neutral-950 border-neutral-800 text-sky-400'
                          : 'bg-neutral-50 border-neutral-200 text-sky-600 shadow-sm'
                      }`}
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
