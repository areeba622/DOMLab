// src/components/landing/LandingNavbar.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { animations } from '../../lib/animations.ts';
//import { animations } from '../../lib/animations.ts';

export function LandingNavbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Add a subtle background blur to the navbar once the user scrolls
  // past the hero — keeps the nav readable against any section content
  // without a hard opaque background blocking the gradient from day one.
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
        <motion.header
        className={[
            'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
            scrolled
            ? 'bg-background/80 backdrop-blur-md border-b border-border'
            : 'bg-transparent',
        ].join(' ')}
        >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        
      <Link to="/" className="flex items-center gap-1 group">
        <span className="font-sans text-2xl font-black leading-none text-accent">
          &lt;
        </span>
        <span className="font-sans text-sm font-bold text-text tracking-widest uppercase px-1">
          DOMLab
        </span>
        <span className="font-sans text-2xl font-black leading-none text-accent">
          &gt;
        </span>
      </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('live-demo')}
            className="font-sans text-sm text-muted transition-colors hover:text-text"
          >
            Features
          </button>

          <button
            onClick={() => scrollToSection('live-demo')}
            className="font-sans text-sm text-muted transition-colors hover:text-text"
          >
            Docs
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Try it CTA */}
          <motion.div {...animations.buttonPress}>
            <Link
              to="/explorer"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-accent bg-accent px-5 py-2 font-sans text-sm font-semibold text-[#0d0d14] shadow-lg transition-all hover:bg-accent/90"
            >
              Try it →
            </Link>
          </motion.div>
        </nav>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-muted"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-text"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="border-t border-border bg-background/95 px-6 py-4 md:hidden"
        >
          <div className="flex flex-col gap-4">
            <button
              onClick={() => scrollToSection('live-demo')}
              className="text-left font-sans text-sm text-muted hover:text-text"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('live-demo')}
              className="text-left font-sans text-sm text-muted hover:text-text"
            >
              Docs
            </button>
            <Link
              to="/explorer"
              onClick={() => setMenuOpen(false)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-accent bg-accent px-5 py-2.5 font-sans text-sm font-semibold text-[#0d0d14]"
            >
              Try it →
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}