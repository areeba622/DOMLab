// src/components/landing/HeroSection.tsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mascot } from '../mascot/Mascot';
import { animations } from '../../lib/animations';

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center px-6 pt-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 md:flex-row md:items-center md:justify-between">

        {/* ── Left: text content ── */}
        <div className="flex flex-col items-start gap-6 md:max-w-xl">

          {/* Badge */}
          <motion.div
            {...animations.fadeUp}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="font-mono text-xs font-medium text-accent tracking-widest uppercase">
              Browser internals, made visible
            </span>
          </motion.div>

          {/* Headline */}
          <div className="flex flex-col gap-1">
            <motion.h1
              {...animations.fadeUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-sans text-5xl font-black leading-none tracking-tight text-text md:text-6xl lg:text-7xl"
            >
              SEE INSIDE
            </motion.h1>
            <motion.h1
              {...animations.fadeUp}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-sans text-5xl font-black leading-none tracking-tight text-accent md:text-6xl lg:text-7xl"
            >
              THE BROWSER.
            </motion.h1>
          </div>

          {/* Subheading */}
          <motion.p
            {...animations.fadeUp}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="font-sans text-base leading-relaxed text-muted md:text-lg"
          >
            Watch HTML transform into a live DOM tree. See every node,
            every attribute, every relationship — then manipulate it
            with JavaScript in real time.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...animations.fadeUp}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            {/* Primary CTA */}
            <motion.div {...animations.buttonPress}>
              <Link
                to="/explorer"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-sans text-sm font-bold text-[#0d0d14] shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 hover:shadow-accent/30"
              >
                TRY IT NOW →
              </Link>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div {...animations.buttonPress}>
              <button
                onClick={() =>
                  document
                    .getElementById('live-demo')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 font-sans text-sm font-medium text-muted transition-colors hover:border-accent/40 hover:text-text"
              >
                See how it works
              </button>
            </motion.div>
          </motion.div>

          {/* Social proof line */}
          <motion.p
            {...animations.fadeUp}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="font-sans text-xs text-muted/60"
          >
            No signup. No install. Just open and explore.
          </motion.p>
        </div>

        {/* ── Right: mascot ── */}
        <div className="flex items-center justify-center">
          <Mascot size={180} />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="font-mono text-xs text-muted/40"
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
}