// src/components/layout/ThemeToggle.tsx
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className="rounded-md border border-border bg-panel px-2 py-1 text-text hover:bg-background transition-colors"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}