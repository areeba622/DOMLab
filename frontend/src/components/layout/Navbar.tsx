// src/components/layout/Navbar.tsx
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { MobileNav } from './MobileNav';

interface NavbarProps {
  onOpenHtmlInput: () => void;
}

export function Navbar({ onOpenHtmlInput }: NavbarProps) {
  return (
    <header className="flex h-12 items-center justify-between border-b-[2.5px] border-line bg-panel px-4">
      <Link to="/" className="flex items-center gap-2 group">
        <span className="flex h-8 w-10 items-center justify-center rounded-md bg-accent">
          <span className="font-mono text-lg font-bold leading-none tracking-tighter text-[#1B1E27]">
            &lt;/&gt;
          </span>
        </span>
        <span className="font-sans text-base font-semibold text-text">
          DOMLab
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenHtmlInput}
          className="border-2 border-line bg-panel px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wide text-text shadow-[var(--db-shadow-offset-sm)] transition-transform hover:text-accentSecondary active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_0_var(--db-line)]"
        >
          Load HTML
        </button>
        <ThemeToggle />
        <MobileNav />
      </div>
    </header>
  );
}