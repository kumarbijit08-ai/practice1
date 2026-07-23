import React, { useState } from 'react';
import { useWeb } from '../context/WebContext';
import { ShieldCheck, Heart, User, Award, Quote, Calendar, Users, Linkedin, Github, Twitter } from 'lucide-react';

export default function About({ theme }: { theme: 'light' | 'dark' }) {
  const { data } = useWeb();
  const [activeTab, setActiveTab] = useState<'story' | 'vision' | 'founder'>('story');

  return (
    <section
      id="about"
      className={`py-24 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            id="about-section-heading"
            className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-2"
          >
            About Mind Map
          </h2>
          <p
            id="about-section-sub"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent"
          >
            Pioneering Applied Technical Curriculums
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-indigo-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Tab Controls (Apple-style pill toggler) */}
        <div className="flex justify-center mb-12">
          <div className={`p-1 rounded-2xl flex gap-1 border ${
            theme === 'dark' ? 'bg-neutral-950/80 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
          }`}>
            <button
              id="tab-story-btn"
              onClick={() => setActiveTab('story')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === 'story'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-neutral-500'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Our Story & Values</span>
            </button>
            <button
              id="tab-vision-btn"
              onClick={() => setActiveTab('vision')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === 'vision'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-neutral-500'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Vision & Mission</span>
            </button>
            <button
              id="tab-founder-btn"
              onClick={() => setActiveTab('founder')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === 'founder'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-neutral-500'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Founder & Team</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div id="about-tab-contents" className="min-h-[400px]">
          
          {/* TAB 1: STORY & VALUES */}
          {activeTab === 'story' && (
            <div id="tab-content-story" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center animate-fade-in">
              <div className="lg:col-span-7 space-y-6">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                  Transforming Classrooms into Design Labs
                </h3>
                <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-600'}`}>
                  {data.about.introduction}
                </p>
                <div className={`p-5 rounded-2xl border ${
                  theme === 'dark' ? 'bg-neutral-950/40 border-neutral-800' : 'bg-neutral-50 border-neutral-200 shadow-sm'
                }`}>
                  <h4 className="font-bold text-sky-400 text-sm uppercase tracking-widest mb-3">Our Core Teaching Philosophy</h4>
                  <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {data.about.philosophy}
                  </p>
                </div>
              </div>

              {/* Core Values grid */}
              <div className="lg:col-span-5 space-y-4">
                <h4 className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Values Driving Our Success
                </h4>
                <div className="space-y-3">
                  {data.about.values.map((val, idx) => (
                    <div
                      key={idx}
                      id={`value-item-${idx}`}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:translate-x-1 ${
                        theme === 'dark'
                          ? 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                          : 'bg-white border-neutral-200 hover:shadow-md'
                      }`}
                    >
                      <div className="flex-shrink-0 p-2 rounded-lg bg-sky-500/10 text-sky-400">
                        <Award className="w-4 h-4" />
                      </div>
                      <span className={`text-sm font-bold tracking-wide ${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-700'}`}>
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VISION & MISSION */}
          {activeTab === 'vision' && (
            <div id="tab-content-vision" className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              {/* Vision Card */}
              <div className={`p-8 rounded-3xl border flex flex-col justify-between relative overflow-hidden group ${
                theme === 'dark'
                  ? 'bg-gradient-to-tr from-neutral-950 to-neutral-900/40 border-neutral-800'
                  : 'bg-white border-neutral-200 shadow-xl'
              }`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full filter blur-2xl group-hover:scale-150 transition-all duration-500" />
                <div className="space-y-6 relative z-10">
                  <div className="p-4 rounded-2xl bg-sky-500/10 text-sky-400 w-fit">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black tracking-tight">Our Vision</h3>
                  <p className={`text-base leading-relaxed whitespace-pre-line ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {data.about.vision}
                  </p>
                </div>
                <div className="w-full h-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 mt-8 rounded-full" />
              </div>

              {/* Mission Card */}
              <div className={`p-8 rounded-3xl border flex flex-col justify-between relative overflow-hidden group ${
                theme === 'dark'
                  ? 'bg-gradient-to-tr from-neutral-950 to-neutral-900/40 border-neutral-800'
                  : 'bg-white border-neutral-200 shadow-xl'
              }`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full filter blur-2xl group-hover:scale-150 transition-all duration-500" />
                <div className="space-y-6 relative z-10">
                  <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black tracking-tight">Our Mission</h3>
                  <p className={`text-base leading-relaxed whitespace-pre-line ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {data.about.mission}
                  </p>
                </div>
                <div className="w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 mt-8 rounded-full" />
              </div>
            </div>
          )}

          {/* TAB 3: THE FOUNDER */}
          {activeTab === 'founder' && (
            <>
              <div id="tab-content-founder" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-fade-in">
              {/* Left Column: Avatar, Name, Title, and Message */}
              <div className="lg:col-span-5 flex flex-col items-center text-center space-y-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-3xl filter blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500" />
                  <img
                    id="founder-avatar"
                    src={data.founder.imageUrl}
                    alt={data.founder.name}
                    className="w-72 h-[360px] object-cover rounded-3xl border border-neutral-800 relative z-10 shadow-2xl"
                  />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{data.founder.name}</h3>
                  <p className="text-sm font-bold text-sky-400 uppercase tracking-widest mt-1">{data.founder.title}</p>
                </div>
                {/* Heartwarming direct message */}
                <div className={`p-6 rounded-2xl border relative w-full text-left ${
                  theme === 'dark' ? 'bg-neutral-950/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <Quote className="absolute -top-3 -left-3 w-8 h-8 text-sky-500/25 fill-current" />
                  <p className={`text-xs italic leading-relaxed relative z-10 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    "{data.founder.message}"
                  </p>
                </div>
              </div>

              {/* Right Column: Bio & Professional Milestones Timeline */}
              <div className="lg:col-span-7 space-y-8">
                {/* Biography */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-sky-500 flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>Founder Biography</span>
                  </h4>
                  <p className={`text-sm leading-relaxed whitespace-pre-wrap ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    {data.founder.bio || "No biographical information has been provided."}
                  </p>
                </div>

                {/* Timeline */}
                {data.founder.timeline && data.founder.timeline.length > 0 && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-sky-500 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Professional Milestones</span>
                    </h4>
                    
                    <div className="relative border-l-2 border-sky-500/30 ml-2.5 pl-6 space-y-6">
                      {data.founder.timeline.map((item, index) => (
                        <div key={index} className="relative group">
                          {/* Timeline dot */}
                          <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-sky-500 border border-neutral-950 group-hover:scale-125 transition-transform" />
                          
                          <div className="space-y-1">
                            <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">
                              {item.year}
                            </span>
                            <p className={`text-sm font-medium mt-1.5 ${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-700'}`}>
                              {item.event}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Meet Our Team Section */}
            <div className="mt-20 pt-16 border-t border-neutral-800/40 w-full animate-fade-in">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h4 className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-2">
                  Our Educators & Mentors
                </h4>
                <p className="text-xl sm:text-2xl font-black tracking-tight">
                  Leading Applied Science & STEM Innovation
                </p>
                <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Our multidisciplinary team of experts helps students build real-world confidence through active learning and technical creation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.team && data.team.map((member) => (
                  <div
                    key={member.id}
                    className={`group relative rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                      theme === 'dark'
                        ? 'bg-neutral-950/40 border-neutral-800/60 hover:border-neutral-700 hover:bg-neutral-900/40'
                        : 'bg-neutral-50 border-neutral-200 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/20 to-indigo-600/20 rounded-3xl filter blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500" />
                        <img
                          src={member.imageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300"}
                          alt={member.name}
                          className="w-56 h-[280px] object-cover rounded-3xl border border-neutral-800 relative z-10 shadow-2xl"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div>
                        <h5 className="font-extrabold text-lg tracking-tight">{member.name}</h5>
                        <p className="text-xs font-bold text-sky-400 uppercase tracking-widest mt-1">
                          {member.designation}
                        </p>
                      </div>

                      <p className={`text-xs leading-relaxed max-w-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {member.bio}
                      </p>

                      {(member.linkedin || member.github || member.twitter) && (
                        <div className="flex items-center gap-3 pt-2">
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`p-1.5 rounded-lg border transition-colors ${
                                theme === 'dark'
                                  ? 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                                  : 'border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                              }`}
                            >
                              <Linkedin className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {member.github && (
                            <a
                              href={member.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`p-1.5 rounded-lg border transition-colors ${
                                theme === 'dark'
                                  ? 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                                  : 'border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                              }`}
                            >
                              <Github className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {member.twitter && (
                            <a
                              href={member.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`p-1.5 rounded-lg border transition-colors ${
                                theme === 'dark'
                                  ? 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                                  : 'border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                              }`}
                            >
                              <Twitter className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        </div>
      </div>
    </section>
  );
}
