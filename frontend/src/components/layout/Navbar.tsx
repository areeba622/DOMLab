// src/components/layout/Navbar.tsx
import { ThemeToggle } from './ThemeToggle';
import { MobileNav } from './MobileNav';

export function Navbar() {
  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-panel px-4">
      <span className="font-sans text-sm font-semibold text-text">DOMLab</span>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <MobileNav />
      </div>
    </header>
  );
}