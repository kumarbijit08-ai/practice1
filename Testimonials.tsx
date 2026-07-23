import React from 'react';
import { useWeb } from '../context/WebContext';
import { Quote, Star } from 'lucide-react';

export default function Testimonials({ theme }: { theme: 'light' | 'dark' }) {
  const { data } = useWeb();

  return (
    <section
      id="testimonials"
      className={`py-24 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            id="testimonials-section-heading"
            className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-2"
          >
            Recommendations
          </h2>
          <p
            id="testimonials-section-sub"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent"
          >
            What Mentors, Parents, & Students Say
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-indigo-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Testimonials Grid */}
        <div id="testimonials-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.testimonials.map((test) => (
            <div
              key={test.id}
              id={`testimonial-card-${test.id}`}
              className={`p-8 rounded-3xl border flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] ${
                theme === 'dark'
                  ? 'bg-neutral-950 border-neutral-800'
                  : 'bg-neutral-50 border-neutral-200 shadow-sm'
              }`}
            >
              {/* Quote marks */}
              <Quote className="absolute top-6 right-6 w-12 h-12 text-sky-500/10 fill-current" />

              <div className="space-y-4 relative z-10">
                {/* Stars rating */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className={`text-sm italic leading-relaxed ${
                  theme === 'dark' ? 'text-neutral-300' : 'text-neutral-600'
                }`}>
                  "{test.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-dashed border-neutral-800">
                <img
                  src={test.avatarUrl}
                  alt={test.name}
                  className="w-12 h-12 rounded-full object-cover border border-neutral-800"
                />
                <div>
                  <h4 className="text-sm font-bold tracking-tight">{test.name}</h4>
                  <p className="text-[11px] font-semibold text-sky-400 tracking-wide mt-0.5">
                    {test.role}
                  </p>
                  <p className="text-[10px] text-neutral-400 font-medium">
                    {test.organization}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
