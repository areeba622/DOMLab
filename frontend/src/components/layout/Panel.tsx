// src/components/layout/Panel.tsx
import type { ReactNode } from 'react';

interface PanelProps {
  title: string;
  children?: ReactNode; /** Optional slot for panel-scoped controls, e.g. the Tree's Toolbar buttons */

  headerActions?: ReactNode;
}

export function Panel({ title, children, headerActions }: PanelProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden border-[2.5px] border-line bg-panel shadow-[var(--db-shadow-offset)]">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <h2 className="font-mono text-xs font-bold text-muted uppercase tracking-wide">
          [ {title} ]
        </h2>
        {headerActions}
      </div>
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>
  );
}