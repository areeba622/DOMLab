// src/components/dom-tree/DomTreeNode.tsx
import { motion, AnimatePresence } from 'framer-motion';
import type { DomNode } from '../../types/dom.types';

interface DomTreeNodeProps {
  node: DomNode;
  isExpanded: boolean;
  isSelected: boolean;
  expandedIds: Set<string>;
  selectedNodeId: string | null;
  onToggleExpand: (id: string) => void;
  onSelect: (id: string) => void;
}

export function DomTreeNode({
  node,
  isExpanded,
  isSelected,
  expandedIds,
  selectedNodeId,
  onToggleExpand,
  onSelect,
}: DomTreeNodeProps) {
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <div
        role="treeitem"
        aria-selected={isSelected}
        onClick={() => onSelect(node.id)}
        className="flex cursor-pointer items-center gap-1 py-1 font-mono text-sm text-text transition-colors hover:text-accentSecondary"
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            aria-label={isExpanded ? 'Collapse node' : 'Expand node'}
            className="flex h-6 w-6 shrink-0 items-center justify-center text-muted md:h-4 md:w-4"
          >
            <motion.span
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.15 }}
              style={{ display: 'inline-block' }}
            >
              ▸
            </motion.span>
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}

        {/* Selection highlight is scoped to just the tag token, not
            the full row — reads as a highlighted terminal token
            rather than a whole-line selection bar. Text color is
            fixed dark in both themes since amber stays light enough
            for dark text to read either way. */}
        <span
          className={
            isSelected
              ? 'border-2 border-line bg-accent px-1.5 text-[#1B1E27]'
              : 'px-0.5'
          }
        >
          &lt;{node.tagName}&gt;
        </span>
      </div>

      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {/* Dashed connector line — one per nesting level, falls
                out of the recursion itself rather than being
                calculated from an absolute depth value. */}
            <div className="ml-2 border-l border-dashed border-border pl-3">
              {node.children.map((child) => (
                <DomTreeNode
                  key={child.id}
                  node={child}
                  isExpanded={expandedIds.has(child.id)}
                  isSelected={selectedNodeId === child.id}
                  expandedIds={expandedIds}
                  selectedNodeId={selectedNodeId}
                  onToggleExpand={onToggleExpand}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}