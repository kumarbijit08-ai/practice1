import React, { useState } from 'react';
import { useWeb } from '../context/WebContext';
import { Eye, X, ZoomIn, Grid } from 'lucide-react';

type FilterType = 'All' | 'Workshop' | 'Projects' | 'Events' | 'Science Exhibition';

export default function Gallery({ theme }: { theme: 'light' | 'dark' }) {
  const { data } = useWeb();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const categories: FilterType[] = ['All', 'Workshop', 'Projects', 'Events', 'Science Exhibition'];

  const filteredGallery = activeFilter === 'All'
    ? data.gallery
    : data.gallery.filter(item => item.category === activeFilter);

  return (
    <section
      id="gallery"
      className={`py-24 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2
            id="gallery-section-heading"
            className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-2"
          >
            Media Showcase
          </h2>
          <p
            id="gallery-section-sub"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent"
          >
            Snapshots of Active Tech Curiosity
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-indigo-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`gallery-filter-${cat.replace(' ', '-')}`}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeFilter === cat
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                  : theme === 'dark'
                  ? 'bg-neutral-950 text-neutral-400 border border-neutral-850 hover:bg-neutral-800'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Responsive Grid */}
        {filteredGallery.length === 0 ? (
          <div id="gallery-empty-state" className="text-center py-16 text-neutral-400">
            <p className="text-sm font-semibold">No media assets in this category yet.</p>
          </div>
        ) : (
          <div id="gallery-photo-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                id={`gallery-item-${item.id}`}
                onClick={() => setZoomImage(item.imageUrl)}
                className={`group relative aspect-[4/3] rounded-3xl overflow-hidden border cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-md ${
                  theme === 'dark' ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                {/* Image */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Glassmorphism Hover Overlay */}
                <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10">
                  <div className="space-y-1.5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-sky-500 text-white w-fit">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-sky-400 font-extrabold tracking-widest flex items-center gap-1 uppercase">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Zoom Asset</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Zoom Overlay */}
      {zoomImage && (
        <div id="gallery-lightbox" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setZoomImage(null)} />
          <div className="relative max-w-4xl max-h-[90vh] z-10">
            <button
              id="close-lightbox-btn"
              onClick={() => setZoomImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white z-20 border border-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomImage}
              alt="Zoomed STEM gallery asset"
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-neutral-800 animate-zoom-in"
            />
          </div>
        </div>
      )}
    </section>
  );
}
