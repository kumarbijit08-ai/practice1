import React, { useEffect, useState } from 'react';
import logoImg from '../assets/images/mindmap_logo_1784265983245.jpg';

export default function Loader({ theme }: { theme: 'light' | 'dark' }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      id="site-loader-overlay"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-500 bg-neutral-950`}
    >
      <div className="relative flex flex-col items-center space-y-6">
        
        {/* Glowing circular tech loader */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-sky-500/20 animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border-4 border-sky-500 border-t-transparent animate-spin" />
          <div className="absolute inset-4 rounded-full bg-white shadow-lg overflow-hidden flex items-center justify-center animate-pulse">
            <img
              src={logoImg}
              alt="Mind Map Logo"
              className="w-full h-full object-contain p-1"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Tagline loader */}
        <div className="text-center space-y-1.5 animate-pulse">
          <span className="text-2xl font-black tracking-widest bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent uppercase">
            Mind Map
          </span>
          <p className="text-[10px] tracking-[0.25em] font-extrabold text-neutral-400 uppercase">
            Learn • Innovate • Create
          </p>
        </div>
      </div>
    </div>
  );
}
