// src/components/layout/MobileNav.tsx
import { useState } from 'react';

const PANEL_LINKS = [
  { id: 'panel-tree', label: 'DOM tree' },
  { id: 'panel-canvas', label: 'Visualization canvas' },
  { id: 'panel-inspector', label: 'Inspector' },
  { id: 'panel-console', label: 'Console' },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToPanel = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsOpen(false);
  };

  return (
    <div className="relative md:hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open panel menu"
        aria-expanded={isOpen}
        className="flex h-11 w-11 items-center justify-center rounded border border-border text-text"
      >
        <span className="font-mono text-lg leading-none">≡</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-10 w-56 rounded border border-border bg-panel shadow-lg">
          {PANEL_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToPanel(link.id)}
              className="block w-full px-4 py-3 text-left font-sans text-sm text-text hover:bg-background"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}