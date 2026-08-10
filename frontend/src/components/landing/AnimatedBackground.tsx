// src/components/landing/AnimatedBackground.tsx
import { useTheme } from '../../context/ThemeContext';

export function AnimatedBackground() {
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 -z-10">
      {/* Base gradient — switches correctly with theme */}
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: isDark
            ? `radial-gradient(ellipse at 70% 0%, #1a1a2e 0%, #12121f 45%, #0d0d14 100%)`
            : `radial-gradient(ellipse at 70% 0%, #dde3f0 0%, #eef0f5 45%, #f6f7f9 100%)`,
        }}
      />

      {/* Noise texture — same in both themes */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Accent glow — amber in dark, slightly muted in light */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? `radial-gradient(ellipse at 0% 30%, rgba(232,163,61,0.04) 0%, transparent 60%)`
            : `radial-gradient(ellipse at 0% 30%, rgba(185,114,15,0.04) 0%, transparent 60%)`,
        }}
      />
    </div>
  );
}