import React, { useState, useEffect } from 'react';
import { WebProvider } from './context/WebContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Programs from './components/Programs';
import Services from './components/Services';
import Projects from './components/Projects';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Loader from './components/Loader';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import StatsGrid from './components/StatsGrid';
import UpdatesModal from './components/UpdatesModal';
import { Bell } from 'lucide-react';

function MainApp() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(false);

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('mindmap_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    } else {
      setTheme('light');
    }
  }, []);

  // Secure backdoor listening (Hash and key combinations)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Access key combo: Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };

    const handleHashChange = () => {
      if (window.location.hash === '#admin-secure' || window.location.hash === '#admin') {
        setIsAdminOpen(true);
        window.location.hash = ''; // clear hash
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashChange);

    // Run once on load
    if (window.location.hash === '#admin-secure' || window.location.hash === '#admin') {
      setIsAdminOpen(true);
      window.location.hash = '';
    }

    // Attach secret globally so the user can open it by typing 'openAdminPanel()' in console if needed
    (window as any).openAdminPanel = () => {
      setIsAdminOpen(true);
      return "CMS Admin Panel revealed.";
    };

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('mindmap_theme', nextTheme);
  };

  return (
    <div id="app-root-container" className={theme === 'dark' ? 'dark' : ''}>
      <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        theme === 'dark' ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'
      }`}>
        
        {/* Full Page Technology Loader */}
        <Loader theme={theme} />

        {/* Dynamic Navigation Bar */}
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          onAdminOpen={() => setIsAdminOpen(true)}
        />
        
        <button
          onClick={() => setIsUpdatesOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 bg-sky-500 text-neutral-900 rounded-full shadow-lg hover:bg-sky-600 transition-all flex items-center gap-2"
        >
          <Bell className="w-5 h-5" />
          <span className="font-bold text-xs uppercase tracking-wider hidden sm:inline">Check Updates</span>
        </button>

        {/* Main Single Page Sections */}
        <main id="main-sections-wrapper" className="relative">
          <Hero theme={theme} />
          <About theme={theme} />
          <Programs theme={theme} />
          <Services theme={theme} />
          <Projects theme={theme} />
          <Gallery theme={theme} />
          <Contact theme={theme} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 my-8">
            <StatsGrid theme={theme} isSmall={true} className="w-full" />
          </div>
        </main>

        {/* Footer with quick navigation */}
        <Footer
          theme={theme}
          onAdminOpen={() => setIsAdminOpen(true)}
        />

        {/* Highly Secure, Hidden Admin Panel */}
        <AdminPanel
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          theme={theme}
        />
        
        <UpdatesModal
          isOpen={isUpdatesOpen}
          onClose={() => setIsUpdatesOpen(false)}
          theme={theme}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <WebProvider>
      <MainApp />
    </WebProvider>
  );
}
