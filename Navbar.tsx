import React, { useState, useEffect } from 'react';
import { useWeb } from '../context/WebContext';
import { Sun, Moon, Menu, X, Cloud } from 'lucide-react';
import logoImg from '../assets/images/new_mindmap_logo_1784630506325.jpg';
import { isFirebaseAvailable } from '../lib/firebase';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onAdminOpen: () => void;
}

export default function Navbar({ theme, toggleTheme, onAdminOpen }: NavbarProps) {
  const { data, isAuthenticated } = useWeb();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Simple active link detection based on section scroll positions
      const sections = ['home', 'about', 'programs', 'services', 'projects', 'gallery', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsOpen(false);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offset = 80; // height of navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = targetElement.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const menuItems = [
    { label: 'Home', target: 'home' },
    { label: 'About Us', target: 'about' },
    { label: 'Programs', target: 'programs' },
    { label: 'Services', target: 'services' },
    { label: 'Projects', target: 'projects' },
    { label: 'Gallery', target: 'gallery' },
    { label: 'Contact', target: 'contact' },
  ];

  return (
    <nav
      id="navbar-main"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? theme === 'dark'
            ? 'bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 shadow-lg'
            : 'bg-white/90 backdrop-blur-md border-b border-neutral-200 shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div className="flex-shrink-0 flex items-center">
            <a
              id="brand-logo-link"
              href="#home"
              onClick={(e) => handleNavClick(e, 'home')}
              className="flex items-center gap-2.5 group"
            >
              <div id="brand-logo-img-container" className="relative flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={data.logoUrl || logoImg}
                  alt="Mind Map Logo"
                  className="w-12 h-12 object-contain rounded-xl bg-white p-0.5 border border-neutral-200/80 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 rounded-xl bg-sky-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span
                    id="brand-name-text"
                    className={`text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent`}
                  >
                    {data.logoText || "Mind Map"}
                  </span>
                  {isFirebaseAvailable && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-sky-400/10 border border-sky-400/25 text-sky-400 text-[8px] font-black uppercase tracking-wider">
                      <Cloud className="w-2.5 h-2.5 animate-pulse" />
                      <span>Cloud Synced</span>
                    </span>
                  )}
                </div>
                <span
                  id="brand-tagline-text"
                  className={`text-[10px] uppercase tracking-widest font-semibold ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
                >
                  {data.tagline || "Learn • Innovate • Create"}
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <a
                key={item.target}
                id={`nav-link-${item.target}`}
                href={`#${item.target}`}
                onClick={(e) => handleNavClick(e, item.target)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 ${
                  activeSection === item.target
                    ? theme === 'dark'
                      ? 'bg-neutral-800 text-sky-400 font-bold'
                      : 'bg-neutral-100 text-sky-600 font-bold'
                    : theme === 'dark'
                    ? 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
                    : 'text-neutral-600 hover:text-black hover:bg-neutral-100/50'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Extra utilities */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark/Light mode button */}
            <button
              id="theme-toggle-button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-neutral-800 text-amber-400 hover:bg-neutral-700'
                  : 'bg-neutral-100 text-indigo-600 hover:bg-neutral-200'
              }`}
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-theme-toggle"
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-neutral-800 text-amber-400'
                  : 'bg-neutral-100 text-indigo-600'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              id="mobile-hamburger-button"
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-xl ${
                theme === 'dark' ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-black'
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          id="mobile-nav-drawer"
          className={`md:hidden animate-fade-in-down border-t transition-colors duration-200 ${
            theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'
          }`}
        >
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <a
                key={item.target}
                id={`mobile-nav-link-${item.target}`}
                href={`#${item.target}`}
                onClick={(e) => handleNavClick(e, item.target)}
                className={`block px-4 py-2.5 rounded-lg text-base font-semibold ${
                  activeSection === item.target
                    ? theme === 'dark'
                      ? 'bg-neutral-800 text-sky-400'
                      : 'bg-neutral-100 text-sky-600'
                    : theme === 'dark'
                    ? 'text-neutral-300 hover:bg-neutral-800'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
