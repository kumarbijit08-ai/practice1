import React, { useState, useEffect } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  angle: number;
}

export default function CircuitRobot({ theme }: { theme: 'light' | 'dark' }) {
  const [electrons, setElectrons] = useState<Particle[]>([]);
  const [pulse, setPulse] = useState<boolean>(false);

  // Generate constant moving particles (electrons)
  useEffect(() => {
    // Populate floating electrons
    const initialElectrons = Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: 0.15 + Math.random() * 0.35,
      size: 1.5 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7,
      angle: Math.random() * Math.PI * 2,
    }));
    setElectrons(initialElectrons);

    const interval = setInterval(() => {
      setPulse((p) => !p);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // Update electrons animation loop
  useEffect(() => {
    let animationId: number;
    const updatePhysics = () => {
      setElectrons((prev) =>
        prev.map((e) => {
          let nextX = e.x + Math.cos(e.angle) * e.speed;
          let nextY = e.y + Math.sin(e.angle) * e.speed;

          // Wrap boundaries smoothly
          if (nextX < -5) nextX = 105;
          if (nextX > 105) nextX = -5;
          if (nextY < -5) nextY = 105;
          if (nextY > 105) nextY = -5;

          return { ...e, x: nextX, y: nextY };
        })
      );
      animationId = requestAnimationFrame(updatePhysics);
    };
    animationId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div 
      className={`w-full max-w-[420px] aspect-square relative rounded-3xl p-4 flex items-center justify-center transition-all duration-500 overflow-hidden ${
        theme === 'dark' 
          ? 'bg-neutral-950 border border-sky-500/15 shadow-[0_0_50px_rgba(56,189,248,0.06)]' 
          : 'bg-white border border-neutral-200/60 shadow-xl shadow-neutral-100/50'
      }`}
      id="elegant-electronic-resonance-field"
    >
      {/* Background Soft Ambient Light */}
      <div className={`absolute -top-12 -left-12 w-48 h-48 rounded-full blur-[80px] pointer-events-none transition-opacity duration-700 ${
        theme === 'dark' ? 'bg-sky-500/10' : 'bg-sky-400/5'
      }`} />
      <div className={`absolute -bottom-12 -right-12 w-48 h-48 rounded-full blur-[80px] pointer-events-none transition-opacity duration-700 ${
        theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-400/5'
      }`} />

      {/* Floating Subatomic Electrons */}
      <div className="absolute inset-0 pointer-events-none">
        {electrons.map((e) => (
          <div
            key={e.id}
            className="absolute rounded-full transition-all duration-300"
            style={{
              left: `${e.x}%`,
              top: `${e.y}%`,
              width: `${e.size}px`,
              height: `${e.size}px`,
              opacity: e.opacity,
              backgroundColor: theme === 'dark' ? '#38bdf8' : '#0284c7',
              boxShadow: `0 0 8px ${theme === 'dark' ? '#38bdf8' : '#0284c7'}`,
            }}
          />
        ))}
      </div>

      {theme === 'light' ? (
        /* ================= LIGHT MODE: EXQUISITE ANIMATED ROBOTICS INTERFACE ================= */
        <svg className="w-full h-full relative z-10 overflow-visible" viewBox="0 0 300 300">
          <defs>
            {/* Soft shadow and gradients for the robot */}
            <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#0284c7" floodOpacity="0.08" />
            </filter>
            
            <linearGradient id="bot-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="60%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>

            <linearGradient id="bot-visor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>

          {/* Interlocking Gears in the Background */}
          {/* Big Gear */}
          <g transform="translate(100, 75)" className="animate-[spin_18s_linear_infinite] origin-center opacity-40" style={{ transformOrigin: '100px 75px' }}>
            <circle cx="0" cy="0" r="24" fill="none" stroke="#cbd5e1" strokeWidth="5" />
            {Array.from({ length: 10 }).map((_, idx) => {
              const angle = (idx * 360) / 10;
              return (
                <rect
                  key={idx}
                  x="-4"
                  y="-32"
                  width="8"
                  height="10"
                  rx="2"
                  fill="#cbd5e1"
                  transform={`rotate(${angle})`}
                />
              );
            })}
            <circle cx="0" cy="0" r="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
          </g>

          {/* Small Interlocking Gear */}
          <g transform="translate(148, 55)" className="animate-[spin_12s_linear_infinite_reverse] origin-center opacity-50" style={{ transformOrigin: '148px 55px' }}>
            <circle cx="0" cy="0" r="15" fill="none" stroke="#94a3b8" strokeWidth="4" />
            {Array.from({ length: 8 }).map((_, idx) => {
              const angle = (idx * 360) / 8 + 22.5; // Offset to interlock correctly
              return (
                <rect
                  key={idx}
                  x="-3"
                  y="-21"
                  width="6"
                  height="7"
                  rx="1.5"
                  fill="#94a3b8"
                  transform={`rotate(${angle})`}
                />
              );
            })}
            <circle cx="0" cy="0" r="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
          </g>

          {/* Circuit Traces floating in the background */}
          <g stroke="#e2e8f0" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
            <path d="M 30,150 L 70,150 L 85,135" />
            <circle cx="30" cy="150" r="3.5" fill="#f8fafc" stroke="#38bdf8" strokeWidth="1.5" />
            
            <path d="M 270,150 L 230,150 L 215,165" />
            <circle cx="270" cy="150" r="3.5" fill="#f8fafc" stroke="#6366f1" strokeWidth="1.5" />

            <path d="M 150,270 L 150,245" />
            <circle cx="150" cy="270" r="3.5" fill="#f8fafc" stroke="#38bdf8" strokeWidth="1.5" />
            
            <path d="M 80,40 L 60,60 L 30,60" />
            <circle cx="30" cy="60" r="3.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />

            <path d="M 220,40 L 240,60 L 270,60" />
            <circle cx="270" cy="60" r="3.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          </g>

          {/* Main Robot Body Group */}
          <g filter="url(#soft-shadow)">
            {/* Robot Neck */}
            <rect x="132" y="215" width="36" height="30" rx="6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
            <line x1="138" y1="228" x2="162" y2="228" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 3" />

            {/* Antennas / Pulsing Ears */}
            {/* Left Antenna */}
            <g transform="translate(62, 160)">
              <rect x="-16" y="-12" width="16" height="24" rx="4" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
              <line x1="-16" y1="0" x2="-32" y2="0" stroke="#64748b" strokeWidth="2" />
              {/* Pulsing Signal circle */}
              <circle cx="-32" cy="0" r="6" fill="#38bdf8" />
              <circle cx="-32" cy="0" r="14" fill="none" stroke="#38bdf8" strokeWidth="1" className="animate-[ping_2s_infinite]" style={{ transformOrigin: '-32px 0px' }} />
            </g>

            {/* Right Antenna */}
            <g transform="translate(238, 160)">
              <rect x="0" y="-12" width="16" height="24" rx="4" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
              <line x1="16" y1="0" x2="32" y2="0" stroke="#64748b" strokeWidth="2" />
              {/* Pulsing Signal circle */}
              <circle cx="32" cy="0" r="6" fill="#6366f1" />
              <circle cx="32" cy="0" r="14" fill="none" stroke="#6366f1" strokeWidth="1" className="animate-[ping_2s_infinite]" style={{ transformOrigin: '32px 0px' }} />
            </g>

            {/* Forehead Antenna */}
            <line x1="150" y1="95" x2="150" y2="70" stroke="#64748b" strokeWidth="3.5" />
            <circle cx="150" cy="65" r="8" fill="#0ea5e9" className="animate-pulse" />
            <circle cx="150" cy="65" r="16" fill="none" stroke="#0ea5e9" strokeWidth="1" className="animate-[ping_2.5s_infinite]" style={{ transformOrigin: '150px 65px' }} />

            {/* Main Head Base */}
            <rect x="68" y="95" width="164" height="130" rx="42" fill="url(#bot-body-grad)" stroke="#94a3b8" strokeWidth="2.5" />

            {/* Head Crest Detail */}
            <path d="M 120,95 Q 150,105 180,95" fill="none" stroke="#cbd5e1" strokeWidth="3" />
            <circle cx="150" cy="108" r="3" fill="#64748b" />

            {/* Dark Visor Window */}
            <rect x="84" y="118" width="132" height="68" rx="22" fill="url(#bot-visor-grad)" stroke="#475569" strokeWidth="2" />

            {/* Inside Visor: Cyber Grid Lines (Subtle) */}
            <g opacity="0.15">
              <line x1="90" y1="135" x2="210" y2="135" stroke="#38bdf8" strokeWidth="1" />
              <line x1="90" y1="152" x2="210" y2="152" stroke="#38bdf8" strokeWidth="1" />
              <line x1="90" y1="169" x2="210" y2="169" stroke="#38bdf8" strokeWidth="1" />
              <line x1="120" y1="120" x2="120" y2="185" stroke="#38bdf8" strokeWidth="1" />
              <line x1="150" y1="120" x2="150" y2="185" stroke="#38bdf8" strokeWidth="1" />
              <line x1="180" y1="120" x2="180" y2="185" stroke="#38bdf8" strokeWidth="1" />
            </g>

            {/* Left Eye Assembly */}
            <g transform="translate(118, 150)" style={{ transformOrigin: '118px 150px' }}>
              {/* Outer pulsing ring */}
              <circle cx="0" cy="0" r="15" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="5 3" className="animate-[spin_6s_linear_infinite]" />
              {/* Inner glowing eye */}
              <circle cx="0" cy="0" r="9" fill="#0ea5e9" className="animate-pulse" />
              <circle cx="0" cy="0" r="4" fill="#ffffff" />
            </g>

            {/* Right Eye Assembly */}
            <g transform="translate(182, 150)" style={{ transformOrigin: '182px 150px' }}>
              {/* Outer pulsing ring */}
              <circle cx="0" cy="0" r="15" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="5 3" className="animate-[spin_6s_linear_infinite_reverse]" />
              {/* Inner glowing eye */}
              <circle cx="0" cy="0" r="9" fill="#6366f1" className="animate-pulse" />
              <circle cx="0" cy="0" r="4" fill="#ffffff" />
            </g>

            {/* Dynamic Equalizer / Mouth inside the visor */}
            <g transform="translate(126, 202)">
              {/* Rounded Mouth panel */}
              <rect x="-10" y="-12" width="68" height="20" rx="10" fill="#1e293b" opacity="0.9" stroke="#334155" strokeWidth="1" />
              
              {/* Dynamic Equalizer Bars */}
              <g transform="translate(0, -2)">
                <rect x="2" y="-1" width="3" height="6" rx="1.5" fill="#38bdf8" className="animate-[bounce_1.4s_infinite_ease-in-out]" style={{ animationDelay: '0.1s' }} />
                <rect x="9" y="-4" width="3" height="12" rx="1.5" fill="#38bdf8" className="animate-[bounce_1.4s_infinite_ease-in-out]" style={{ animationDelay: '0.3s' }} />
                <rect x="16" y="-7" width="3" height="18" rx="1.5" fill="#6366f1" className="animate-[bounce_1.4s_infinite_ease-in-out]" style={{ animationDelay: '0.5s' }} />
                <rect x="23" y="-9" width="3" height="22" rx="1.5" fill="#818cf8" className="animate-[bounce_1.4s_infinite_ease-in-out]" style={{ animationDelay: '0.2s' }} />
                <rect x="30" y="-7" width="3" height="18" rx="1.5" fill="#6366f1" className="animate-[bounce_1.4s_infinite_ease-in-out]" style={{ animationDelay: '0.4s' }} />
                <rect x="37" y="-4" width="3" height="12" rx="1.5" fill="#38bdf8" className="animate-[bounce_1.4s_infinite_ease-in-out]" style={{ animationDelay: '0.6s' }} />
                <rect x="44" y="-1" width="3" height="6" rx="1.5" fill="#38bdf8" className="animate-[bounce_1.4s_infinite_ease-in-out]" style={{ animationDelay: '0.15s' }} />
              </g>
            </g>

            {/* Cute Cheek indicators */}
            <circle cx="98" cy="176" r="3.5" fill="#ef4444" opacity="0.6" className="animate-pulse" />
            <circle cx="202" cy="176" r="3.5" fill="#ef4444" opacity="0.6" className="animate-pulse" />
          </g>

          {/* Little Floating Decorative Sparks */}
          <g>
            <circle cx="50" cy="100" r="2" fill="#38bdf8" className="animate-ping" style={{ animationDelay: '0.5s' }} />
            <circle cx="250" cy="110" r="2" fill="#6366f1" className="animate-ping" style={{ animationDelay: '1.2s' }} />
          </g>
        </svg>
      ) : (
        /* ================= DARK MODE: DETAILED MASTER CIRCUIT ART ================= */
        <svg className="w-full h-full relative z-10 overflow-visible" viewBox="0 0 300 300">
          <defs>
            {/* Glowing Filters */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-indigo" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Linear Gradients for Premium Circuit Lines */}
            <linearGradient id="trace-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="trace-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Outer Circular Ground/Shield Traces */}
          <circle 
            cx="150" cy="150" r="120" 
            fill="none" 
            stroke={theme === 'dark' ? 'rgba(56,189,248,0.1)' : 'rgba(2,132,199,0.06)'} 
            strokeWidth="1.5" 
            strokeDasharray="10 15" 
            className="animate-[spin_60s_linear_infinite]"
          />
          <circle 
            cx="150" cy="150" r="100" 
            fill="none" 
            stroke={theme === 'dark' ? 'rgba(129,140,248,0.08)' : 'rgba(79,70,229,0.05)'} 
            strokeWidth="1" 
            strokeDasharray="6 8" 
            className="animate-[spin_40s_linear_infinite_reverse]"
          />

          {/* Complex Branching Electronic Circuit Lines */}
          <g strokeLinecap="round">
            {/* North Branch */}
            <path d="M 150,50 L 150,100" fill="none" stroke="url(#trace-grad-1)" strokeWidth="2" />
            <path d="M 150,65 L 120,45" fill="none" stroke="url(#trace-grad-1)" strokeWidth="1.5" />
            <path d="M 150,80 L 180,60" fill="none" stroke="url(#trace-grad-1)" strokeWidth="1.5" />
            
            {/* East Branch */}
            <path d="M 250,150 L 200,150" fill="none" stroke="url(#trace-grad-1)" strokeWidth="2" />
            <path d="M 235,150 L 255,130" fill="none" stroke="url(#trace-grad-1)" strokeWidth="1.5" />
            <path d="M 215,150 L 235,170" fill="none" stroke="url(#trace-grad-1)" strokeWidth="1.5" />

            {/* South Branch */}
            <path d="M 150,250 L 150,200" fill="none" stroke="url(#trace-grad-2)" strokeWidth="2" />
            <path d="M 150,235 L 180,255" fill="none" stroke="url(#trace-grad-2)" strokeWidth="1.5" />
            <path d="M 150,220 L 120,240" fill="none" stroke="url(#trace-grad-2)" strokeWidth="1.5" />

            {/* West Branch */}
            <path d="M 50,150 L 100,150" fill="none" stroke="url(#trace-grad-2)" strokeWidth="2" />
            <path d="M 65,150 L 45,170" fill="none" stroke="url(#trace-grad-2)" strokeWidth="1.5" />
            <path d="M 85,150 L 65,130" fill="none" stroke="url(#trace-grad-2)" strokeWidth="1.5" />

            {/* Diagonals */}
            <path d="M 79,79 L 114,114" fill="none" stroke={theme === 'dark' ? 'rgba(56,189,248,0.2)' : 'rgba(2,132,199,0.1)'} strokeWidth="1.5" />
            <path d="M 221,79 L 186,114" fill="none" stroke={theme === 'dark' ? 'rgba(56,189,248,0.2)' : 'rgba(2,132,199,0.1)'} strokeWidth="1.5" />
            <path d="M 79,221 L 114,186" fill="none" stroke={theme === 'dark' ? 'rgba(129,140,248,0.2)' : 'rgba(79,70,229,0.1)'} strokeWidth="1.5" />
            <path d="M 221,221 L 186,186" fill="none" stroke={theme === 'dark' ? 'rgba(129,140,248,0.2)' : 'rgba(79,70,229,0.1)'} strokeWidth="1.5" />
          </g>

          {/* Small Node Terminals / Solder Pads */}
          <g fill={theme === 'dark' ? '#0f172a' : '#f8fafc'}>
            <circle cx="120" cy="45" r="3" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="180" cy="60" r="3" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="255" cy="130" r="3" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="235" cy="170" r="3" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="180" cy="255" r="3" stroke="#f472b6" strokeWidth="1.5" />
            <circle cx="120" cy="240" r="3" stroke="#f472b6" strokeWidth="1.5" />
            <circle cx="45" cy="170" r="3" stroke="#f472b6" strokeWidth="1.5" />
            <circle cx="65" cy="130" r="3" stroke="#f472b6" strokeWidth="1.5" />
          </g>

          {/* Continuous Flowing Active Electron Pulses (Moving along path) */}
          <g>
            {/* North to center electron */}
            <circle r="4.5" fill="#38bdf8" filter="url(#glow-cyan)" className="animate-[pulse-n_3s_infinite_linear]" />
            {/* East to center electron */}
            <circle r="4.5" fill="#818cf8" filter="url(#glow-indigo)" className="animate-[pulse-e_4s_infinite_linear]" />
            {/* South to center electron */}
            <circle r="4.5" fill="#f472b6" filter="url(#glow-cyan)" className="animate-[pulse-s_3.5s_infinite_linear]" />
            {/* West to center electron */}
            <circle r="4.5" fill="#38bdf8" filter="url(#glow-indigo)" className="animate-[pulse-w_4.5s_infinite_linear]" />
          </g>

          {/* Central Microprocessor/Chip Core Plate */}
          <g className="transition-transform duration-500">
            {/* Outer golden contacts */}
            <rect 
              x="116" y="116" width="68" height="68" rx="8" 
              fill={theme === 'dark' ? '#1e293b' : '#e2e8f0'} 
              stroke={theme === 'dark' ? '#f59e0b' : '#d97706'} 
              strokeWidth="2.5" 
              className="transition-all duration-300"
            />
            {/* Silicon Die */}
            <rect 
              x="124" y="124" width="52" height="52" rx="6" 
              fill={theme === 'dark' ? '#0f172a' : '#ffffff'} 
              stroke={theme === 'dark' ? 'rgba(56,189,248,0.4)' : 'rgba(2,132,199,0.3)'} 
              strokeWidth="1.5" 
            />

            {/* Dynamic Core Glow */}
            <circle 
              cx="150" cy="150" r="16" 
              fill="none" 
              stroke={theme === 'dark' ? '#38bdf8' : '#0284c7'} 
              strokeWidth="3.5"
              strokeDasharray={pulse ? '10 4' : '4 10'} 
              className="transition-all duration-1000 ease-in-out"
              style={{
                filter: `drop-shadow(0 0 6px ${theme === 'dark' ? '#38bdf8' : '#0284c7'})`
              }}
            />

            {/* Central Processor Node (Glowing Crystal) */}
            <rect 
              x="142" y="142" width="16" height="16" rx="4" 
              fill={theme === 'dark' ? '#38bdf8' : '#0284c7'} 
              className={`transition-all duration-1000 ${pulse ? 'opacity-100 scale-110' : 'opacity-70 scale-95'}`}
              style={{
                transformOrigin: '150px 150px',
              }}
            />
          </g>
        </svg>
      )}

      {/* Styled Inline Keyframes for Electron Flow Paths */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-n {
          0% { cx: 150px; cy: 50px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { cx: 150px; cy: 116px; opacity: 0; }
        }
        @keyframes pulse-e {
          0% { cx: 250px; cy: 150px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { cx: 184px; cy: 150px; opacity: 0; }
        }
        @keyframes pulse-s {
          0% { cx: 150px; cy: 250px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { cx: 150px; cy: 184px; opacity: 0; }
        }
        @keyframes pulse-w {
          0% { cx: 50px; cy: 150px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { cx: 116px; cy: 150px; opacity: 0; }
        }
      `}} />
    </div>
  );
}
