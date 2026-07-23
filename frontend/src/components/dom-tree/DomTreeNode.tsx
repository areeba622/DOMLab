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
        style={{ paddingLeft: `${node.depth * 16}px` }}
        className={[
          'flex cursor-pointer items-center gap-1 rounded px-2 py-1 font-mono text-sm transition-colors duration-150',
          isSelected
            ? 'border-l-2 border-accent bg-accent/10 text-accent'
            : 'border-l-2 border-transparent text-text hover:bg-accentSecondary/10',
        ].join(' ')}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            aria-label={isExpanded ? 'Collapse node' : 'Expand node'}
            /* CHANGED: Updated touch target size for expand/collapse arrow button */
            className="flex h-6 w-6 items-center justify-center text-muted md:h-4 md:w-4"
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
          <span className="w-4" />
        )}

        <span>&lt;{node.tagName}&gt;</span>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}