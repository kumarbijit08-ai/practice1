import React from 'react';
import { useWeb } from '../context/WebContext';
import { Cpu, Award, School, Users, CheckCircle } from 'lucide-react';

export default function Services({ theme }: { theme: 'light' | 'dark' }) {
  const { data } = useWeb();

  // Map string to Lucide React component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-8 h-8 text-sky-400" />;
      case 'Award': return <Award className="w-8 h-8 text-indigo-400" />;
      case 'School': return <School className="w-8 h-8 text-purple-400" />;
      case 'Users': return <Users className="w-8 h-8 text-emerald-400" />;
      default: return <Cpu className="w-8 h-8 text-sky-400" />;
    }
  };

  return (
    <section
      id="services"
      className={`py-24 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            id="services-section-heading"
            className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-2"
          >
            Services Offered
          </h2>
          <p
            id="services-section-sub"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent"
          >
            Empowering Institutes & Individuals
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-indigo-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Services Grid */}
        <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.services.map((service) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className={`p-8 rounded-3xl border flex flex-col md:flex-row gap-6 relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] ${
                theme === 'dark'
                  ? 'bg-neutral-950/60 border-neutral-800 hover:border-sky-500/20'
                  : 'bg-neutral-50 border-neutral-200 hover:border-sky-500/10'
              }`}
            >
              {/* Service Icon Panel */}
              <div className="flex-shrink-0">
                <div className="p-4 rounded-2xl bg-neutral-500/5 group-hover:scale-110 transition-transform duration-300 w-fit">
                  {getIcon(service.icon)}
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold tracking-tight">
                  {service.title}
                </h3>
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  {service.description}
                </p>

                {/* Features list */}
                <ul className="space-y-2 pt-2">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-neutral-400">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Decorative side accent */}
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-tr from-sky-500/5 to-indigo-500/5 rounded-tl-full -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
