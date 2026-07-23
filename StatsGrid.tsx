import React, { useState, useEffect } from 'react';
import { useWeb } from '../context/WebContext';
import * as Icons from 'lucide-react';

interface StatsGridProps {
  theme: 'light' | 'dark';
  className?: string;
  isSmall?: boolean;
}

export default function StatsGrid({ theme, className = '', isSmall = false }: StatsGridProps) {
  const { data } = useWeb();
  const [animatedStats, setAnimatedStats] = useState<Record<string, number>>({});

  const visibleStats = (data.stats || []).filter(stat => stat.enabled !== false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const targets: Record<string, number> = {};
      visibleStats.forEach(stat => {
        const numericVal = parseInt(stat.value.replace(/[^0-9]/g, ''), 10);
        targets[stat.id] = isNaN(numericVal) ? 0 : numericVal;
      });
      setAnimatedStats(targets);
    }, 500);
    return () => clearTimeout(timer);
  }, [data.stats]);

  const getIcon = (iconName: string) => {
    const iconClass = isSmall ? "w-4 h-4 md:w-5 h-5" : "w-6 h-6";
    // Dynamically retrieve the component from the imported Icons namespace
    const IconComponent = (Icons as any)[iconName] || Icons.Cpu;
    
    // Choose gradient/text color based on icon name hash to make them colorful
    const colors = [
      'text-sky-400',
      'text-indigo-400',
      'text-purple-400',
      'text-emerald-400',
      'text-rose-400',
      'text-amber-400',
      'text-pink-400'
    ];
    let charSum = 0;
    for (let i = 0; i < iconName.length; i++) {
      charSum += iconName.charCodeAt(i);
    }
    const colorClass = colors[charSum % colors.length];

    return <IconComponent className={`${iconClass} ${colorClass}`} />;
  };

  if (visibleStats.length === 0) return null;

  // Dynamically set grid columns depending on visible stats count
  const colsCount = visibleStats.length;
  const gridColsClass = colsCount <= 2 
    ? 'grid-cols-2' 
    : colsCount === 3 
      ? 'grid-cols-2 md:grid-cols-3' 
      : colsCount === 4 
        ? 'grid-cols-2 md:grid-cols-4' 
        : 'grid-cols-2 md:grid-cols-5';

  return (
    <div
      id="hero-statistics-grid"
      className={`grid ${gridColsClass} gap-4 transition-colors duration-200 ${
        isSmall
          ? 'gap-2 md:gap-3 p-3 sm:p-4 rounded-xl'
          : 'gap-4 md:gap-6 p-6 sm:p-8 rounded-2xl'
      } ${
        theme === 'dark'
          ? 'bg-neutral-900/40 border-neutral-800 backdrop-blur-md border'
          : 'bg-white border-neutral-200 shadow-xl shadow-neutral-100 border'
      } ${className}`}
    >
      {visibleStats.map((stat) => (
        <div
          key={stat.id}
          id={`stat-card-${stat.id}`}
          className={`flex flex-col items-center text-center rounded-xl hover:scale-105 transition-all duration-300 group ${
            isSmall ? 'p-1.5 sm:p-2' : 'p-3 sm:p-4'
          }`}
        >
          <div className={`rounded-xl bg-neutral-500/5 group-hover:scale-110 transition-transform duration-300 ${
            isSmall ? 'p-1.5 mb-1.5' : 'p-3 mb-3'
          }`}>
            {getIcon(stat.icon)}
          </div>
          <span className={`font-black tracking-tight bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent ${
            isSmall ? 'text-lg sm:text-xl md:text-2xl' : 'text-3xl sm:text-4xl'
          }`}>
            {(() => {
              const animatedVal = animatedStats[stat.id];
              if (animatedVal === undefined) return stat.value;
              const match = stat.value.match(/^(\d+)(.*)$/);
              if (match) {
                const suffix = match[2];
                return `${animatedVal}${suffix}`;
              }
              return `${animatedVal}`;
            })()}
          </span>
          <span className={`tracking-wide mt-1 ${
            isSmall
              ? 'text-[10px] sm:text-xs font-medium'
              : 'text-xs sm:text-sm font-semibold'
          } ${
            theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
          }`}>
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
