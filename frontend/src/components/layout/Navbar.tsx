// src/components/layout/Navbar.tsx
import { ThemeToggle } from './ThemeToggle';
import { MobileNav } from './MobileNav';

interface NavbarProps {
  onOpenHtmlInput: () => void;
}

export function Navbar({ onOpenHtmlInput }: NavbarProps) {
  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-panel px-4">
      <span className="font-sans text-sm font-semibold text-text">DOMLab</span>
      <div className="flex items-center gap-2">
        <button 
          onClick={onOpenHtmlInput}
          className="rounded border border-border px-3 py-1.5 font-sans text-xs font-medium text-text transition-colors hover:border-accentSecondary"
        >
          Load HTML
        </button >
        <ThemeToggle />
        <MobileNav />
      </div>
    </header>
  );
}