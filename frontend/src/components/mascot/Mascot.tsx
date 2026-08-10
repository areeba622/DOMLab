// src/components/mascot/Mascot.tsx
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

interface MascotProps {
  size?: number;
  className?: string;
}

export function Mascot({ size = 120, className = '' }: MascotProps) {
  const armControls = useAnimation();
  const bodyControls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      // Step 1: wave arm once
      await armControls.start({
        rotate: [0, 25, -10, 25, -5, 0],
        transition: { duration: 1.4, ease: 'easeInOut' },
      });
      // Step 2: settle into continuous idle bob
      bodyControls.start({
        y: [0, -6, 0],
        transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
      });
    };
    // Small delay so the wave starts after the hero text has
    // already begun animating in — mascot arrival feels coordinated,
    // not simultaneous/competing with the headline
    const timer = setTimeout(sequence, 800);
    return () => clearTimeout(timer);
  }, [armControls, bodyControls]);

  return (
    <motion.div
      // Entrance: slides in from right
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      className={className}
    >
      <motion.svg
        animate={bodyControls}
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Body: rounded rect, the "screen/tag" shape ── */}
        <rect
          x="20" y="28"
          width="80" height="70"
          rx="18"
          fill="#242A35"
          stroke="#E8A33D"
          strokeWidth="3"
        />

        {/* ── Left bracket  < ── */}
        <text
          x="26" y="72"
          fontFamily="JetBrains Mono, monospace"
          fontSize="28"
          fontWeight="700"
          fill="#E8A33D"
        >
          &lt;
        </text>

        {/* ── Right bracket  > ── */}
        <text
          x="72" y="72"
          fontFamily="JetBrains Mono, monospace"
          fontSize="28"
          fontWeight="700"
          fill="#E8A33D"
        >
          &gt;
        </text>

        {/* ── Eyes ── */}
        <circle cx="50" cy="55" r="4" fill="#E7E9EE" />
        <circle cx="70" cy="55" r="4" fill="#E7E9EE" />

        {/* ── Pupils (looking slightly right, curious) ── */}
        <circle cx="51.5" cy="55.5" r="2" fill="#0d0d14" />
        <circle cx="71.5" cy="55.5" r="2" fill="#0d0d14" />

        {/* ── Smile ── */}
        <path
          d="M 48 66 Q 60 74 72 66"
          stroke="#E7E9EE"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Left arm (static) ── */}
        <line
          x1="20" y1="58"
          x2="6" y2="72"
          stroke="#E8A33D"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* ── Right arm (waves) ── */}
        <motion.line
          animate={armControls}
          x1="100" y1="58"
          x2="114" y2="44"
          stroke="#E8A33D"
          strokeWidth="4"
          strokeLinecap="round"
          style={{ originX: '100px', originY: '58px' }}
        />

        {/* ── Legs ── */}
        <line
          x1="50" y1="98"
          x2="44" y2="114"
          stroke="#E8A33D"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="70" y1="98"
          x2="76" y2="114"
          stroke="#E8A33D"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </motion.svg>
    </motion.div>
  );
}