// src/components/dom-tree/DomTreeToolbar.tsx

interface DomTreeToolbarProps {
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export function DomTreeToolbar({ onExpandAll, onCollapseAll }: DomTreeToolbarProps) {
  return (
    <div className="mb-3 flex gap-2 border-b border-dashed border-border pb-3">
      <button
        onClick={onExpandAll}
        className="border-2 border-line bg-panel px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-muted shadow-[var(--db-shadow-offset-sm)] transition-transform hover:text-accentSecondary active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_0_var(--db-line)]"
      >
        Expand all
      </button>
      <button
        onClick={onCollapseAll}
        className="border-2 border-line bg-panel px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-muted shadow-[var(--db-shadow-offset-sm)] transition-transform hover:text-accentSecondary active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_0_var(--db-line)]"
      >
        Collapse all
      </button>
    </div>
  );
}