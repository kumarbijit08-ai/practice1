import React, { useState, useEffect } from 'react';
import { useWeb } from '../context/WebContext';
import { Cpu, Award, School, Users, Calendar, Sparkles, BookOpen, ArrowRight, X } from 'lucide-react';
import CircuitRobot from './CircuitRobot';
import StatsGrid from './StatsGrid';

export default function Hero({ theme }: { theme: 'light' | 'dark' }) {
  const { data, addEnquiry } = useWeb();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: '', email: '', phone: '', grade: 'Middle School', message: '' });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoForm.name || !demoForm.email || !demoForm.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    addEnquiry({
      name: demoForm.name,
      email: demoForm.email,
      phone: demoForm.phone,
      subject: `Free Demo Booking (${demoForm.grade})`,
      message: demoForm.message || "Requested a free demo session for STEM/Robotics curricula.",
    });

    setSubmitSuccess(true);
    setTimeout(() => {
      setShowDemoModal(false);
      setDemoForm({ name: '', email: '', phone: '', grade: 'Middle School', message: '' });
      setSubmitSuccess(false);
    }, 2000);
  };

  const scrollSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="home"
      className={`relative min-h-screen pt-28 pb-16 flex flex-col justify-center overflow-hidden transition-colors duration-200 ${
        theme === 'dark' ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'
      }`}
    >
      {/* Background Decorative Mesh & Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Glowing fluid circles */}
        <div className={`absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full filter blur-[120px] opacity-25 bg-gradient-to-tr from-sky-400 to-indigo-600`} />
        <div className={`absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full filter blur-[120px] opacity-20 bg-gradient-to-tr from-purple-500 to-rose-600`} />
        
        {/* Subtle grid pattern overlay */}
        <div className={`absolute inset-0 opacity-[0.03] ${theme === 'dark' ? 'bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]' : 'bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:32px_32px]'}`} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-center lg:text-left">
            <div className="inline-flex self-center lg:self-start items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>STEM Learning & Innovation Hub</span>
            </div>

            <h1
              id="hero-main-title"
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent"
            >
              {data.heroHeadline || "Inspiring Innovation Through Practical Learning"}
            </h1>

            <p
              id="hero-sub-text"
              className={`text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              {data.heroSubheading || "Empowering learners with practical technology education, innovation, creativity, engineering, and future-ready skills."}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                id="cta-book-demo-btn"
                onClick={() => setShowDemoModal(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold tracking-wide text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 hover:scale-[1.02] shadow-lg shadow-sky-500/20 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Book Free Demo
              </button>
              <button
                id="cta-explore-programs-btn"
                onClick={() => scrollSection('programs')}
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-neutral-900 text-white hover:bg-neutral-800 border border-neutral-800'
                    : 'bg-white text-neutral-800 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                <span>Explore Programs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="cta-contact-btn"
                onClick={() => scrollSection('contact')}
                className={`w-full sm:w-auto px-6 py-4 rounded-xl font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                  theme === 'dark'
                    ? 'text-neutral-400 hover:text-white'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* Hero Right Content - Advanced Interactive SVG Graphic */}
          <div className="lg:col-span-5 flex justify-center relative">
            {/* Ambient holographic soft background glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-sky-500/15 via-indigo-500/5 to-purple-500/15 rounded-[40px] blur-3xl opacity-65 pointer-events-none -z-10" />

            {/* The selected element - Clean, elegant, simple container */}
            <div className="w-full max-w-[420px] rounded-3xl relative overflow-hidden flex flex-col items-center justify-center">
              {/* The Robot Component itself */}
              <CircuitRobot theme={theme} />
            </div>
          </div>
        </div>
      </div>

      {/* Free Demo Registration Modal */}
      {showDemoModal && (
        <div id="demo-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDemoModal(false)} />
          <div
            id="demo-modal-content"
            className={`relative w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl overflow-hidden transition-colors duration-200 ${
              theme === 'dark' ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            <button
              id="close-demo-modal-btn"
              onClick={() => setShowDemoModal(false)}
              className={`absolute top-4 right-4 p-2 rounded-full ${
                theme === 'dark' ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-black bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
                Book a Free Live Demo!
              </h3>
              <p className={`text-sm mt-1.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Schedule an online or offline robotics & programming session with Chief Mentor Bijit Kumar Prasad.
              </p>
            </div>

            {submitSuccess ? (
              <div id="demo-submit-success" className="py-12 text-center flex flex-col items-center">
                <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 animate-bounce">
                  <Award className="w-12 h-12" />
                </div>
                <h4 className="text-lg font-bold text-emerald-500">Booking Request Submitted!</h4>
                <p className="text-sm text-neutral-400 mt-1">Our training counselor will contact you within 24 hours.</p>
              </div>
            ) : (
              <form id="demo-booking-form" onSubmit={handleDemoSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Student Name *</label>
                  <input
                    type="text"
                    required
                    value={demoForm.name}
                    onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                      theme === 'dark'
                        ? 'bg-neutral-800 border-neutral-700 text-white focus:border-sky-500'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-sky-500'
                    }`}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                        theme === 'dark'
                          ? 'bg-neutral-800 border-neutral-700 text-white focus:border-sky-500'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-sky-500'
                      }`}
                      placeholder="e.g. name@mail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={demoForm.phone}
                      onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                        theme === 'dark'
                          ? 'bg-neutral-800 border-neutral-700 text-white focus:border-sky-500'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-sky-500'
                      }`}
                      placeholder="e.g. +91 9901993468"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Age Group / Grade</label>
                  <select
                    value={demoForm.grade}
                    onChange={(e) => setDemoForm({ ...demoForm, grade: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                      theme === 'dark'
                        ? 'bg-neutral-800 border-neutral-700 text-white focus:border-sky-500'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-sky-500'
                    }`}
                  >
                    <option>Elementary School (Grade 4-5)</option>
                    <option>Middle School (Grade 6-8)</option>
                    <option>High School (Grade 9-12)</option>
                    <option>University / Professional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Short Message / Focus Interest</label>
                  <textarea
                    rows={2}
                    value={demoForm.message}
                    onChange={(e) => setDemoForm({ ...demoForm, message: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                      theme === 'dark'
                        ? 'bg-neutral-800 border-neutral-700 text-white focus:border-sky-500'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-sky-500'
                    }`}
                    placeholder="Describe any particular interest (e.g. Robotics, Arduino Coding)"
                  />
                </div>

                <button
                  type="submit"
                  id="submit-demo-booking-btn"
                  className="w-full py-4 rounded-xl font-bold tracking-wide text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 transition-colors cursor-pointer"
                >
                  Submit Demo Booking
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
