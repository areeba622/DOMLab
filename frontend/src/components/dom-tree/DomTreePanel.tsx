// src/components/dom-tree/DomTreePanel.tsx
import { useDomTree } from '../../hooks/useDomTree';
import { Panel } from '../layout/Panel';
import { DomTreeToolbar } from './DomTreeToolbar';
import { DomTree } from './DomTree';
import { collectAllIds } from '../../utils/domParser';
import type { DomNode } from '../../types/dom.types';

interface DomTreePanelProps {
  rootNode: DomNode;
}

export function DomTreePanel({ rootNode }: DomTreePanelProps) {
  const { expandedIds, toggleExpand, expandAll, collapseAll } = useDomTree([rootNode.id]);

  return (
    <Panel title="DOM tree">
      <DomTreeToolbar
        onExpandAll={() => expandAll(collectAllIds(rootNode))}
        onCollapseAll={collapseAll}
      />
      <DomTree rootNode={rootNode} expandedIds={expandedIds} onToggleExpand={toggleExpand} />
    </Panel>
  );
}