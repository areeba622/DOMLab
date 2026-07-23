// src/components/dom-tree/DomTree.tsx  (updated)
import { useSelectedNode } from '../../context/SelectedNodeContext';
import { DomTreeNode } from './DomTreeNode';
import type { DomNode } from '../../types/dom.types';

interface DomTreeProps {
  rootNode: DomNode;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
}

export function DomTree({ rootNode, expandedIds, onToggleExpand }: DomTreeProps) {
  const { selectedNodeId, selectNode } = useSelectedNode();

  return (
    <div role="tree">
      <DomTreeNode
        node={rootNode}
        isExpanded={expandedIds.has(rootNode.id)}
        isSelected={selectedNodeId === rootNode.id}
        expandedIds={expandedIds}
        selectedNodeId={selectedNodeId}
        onToggleExpand={onToggleExpand}
        onSelect={selectNode}
      />
    </div>
  );
}