// src/components/dom-tree/DomTreeToolbar.tsx

interface DomTreeToolbarProps {
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export function DomTreeToolbar({ onExpandAll, onCollapseAll }: DomTreeToolbarProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onExpandAll}
        className="rounded border border-border px-2 py-1 font-sans text-xs text-muted hover:text-text hover:border-accentSecondary transition-colors"
      >
        Expand all
      </button>
      <button
        onClick={onCollapseAll}
        className="rounded border border-border px-2 py-1 font-sans text-xs text-muted hover:text-text hover:border-accentSecondary transition-colors"
      >
        Collapse all
      </button>
    </div>
  );
}