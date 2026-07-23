import React from 'react';
import { useWeb } from '../context/WebContext';
import { ChevronUp, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import logoImg from '../assets/images/mindmap_logo_1784265983245.jpg';

interface FooterProps {
  theme: 'light' | 'dark';
  onAdminOpen: () => void;
}

export default function Footer({ theme, onAdminOpen }: FooterProps) {
  const { data } = useWeb();

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
    <footer
      id="footer-main"
      className={`border-t transition-colors duration-200 ${
        theme === 'dark' ? 'bg-neutral-950 border-neutral-900 text-white' : 'bg-white border-neutral-200 text-neutral-900 shadow-inner'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Logo Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={data.contact.footerLogoUrl || logoImg}
                alt="Mind Map Logo"
                className="w-10 h-10 object-contain rounded-lg bg-white p-0.5 border border-neutral-200/40 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                {data.logoText || "Mind Map"}
              </span>
            </div>
            <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              STEM Education and Innovation Company providing practical learning in electronics, Arduino, robotics, coding, AI, and IoT solutions.
            </p>
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-sky-400 block pt-1">
              {data.tagline || "Learn • Innovate • Create"}
            </span>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400">Quick Links</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              {[
                { name: 'Home', id: 'home' },
                { name: 'About Us', id: 'about' },
                { name: 'Programs Offered', id: 'programs' },
                { name: 'Services Offered', id: 'services' },
                { name: 'Showcase Projects', id: 'projects' },
                { name: 'Media Gallery', id: 'gallery' }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollSection(link.id)}
                    className="text-neutral-400 hover:text-sky-400 hover:translate-x-1 transition-all cursor-pointer"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Contact Specs */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400">Contact Details</h4>
            <ul className="space-y-3.5 text-xs font-semibold text-neutral-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>{data.contact.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <a href={`tel:${data.contact.phone}`} className="hover:text-sky-400 transition-colors">
                  {data.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <a href={`mailto:${data.contact.email}`} className="hover:text-sky-400 transition-colors break-all">
                  {data.contact.email}
                </a>
              </li>
              {/* Social Links */}
              <li className="flex items-center gap-3 pt-2">
                {data.contact.facebook && (
                  <a href={data.contact.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {data.contact.instagram && (
                  <a href={data.contact.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {data.contact.linkedin && (
                  <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {data.contact.youtube && (
                  <a href={data.contact.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </li>
            </ul>
          </div>

          </div>

        </div>

        {/* Bottom Panel */}
        <div className="mt-16 pt-8 border-t border-neutral-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            © {new Date().getFullYear()}{' '}
            {theme === 'light' ? (
              <span
                id="footer-hidden-cms-trigger"
                onClick={onAdminOpen}
                className="cursor-pointer font-extrabold text-neutral-500 hover:text-sky-600 transition-colors"
                title="Admin Gateway"
              >
                Mind Map
              </span>
            ) : (
              <span>Mind Map</span>
            )}{' '}
            STEM Education. All Rights Reserved.
          </p>
          
          {/* Back to Top button */}
          <button
            id="back-to-top-btn"
            onClick={handleScrollToTop}
            className={`p-2.5 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              theme === 'dark'
                ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-sky-400 hover:bg-neutral-800'
                : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-sky-600 hover:bg-neutral-200'
            }`}
            title="Back to Top"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
    </footer>
  );
}
