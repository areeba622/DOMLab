// src/components/layout/StatusBar.tsx
import { useSelectedNode } from '../../context/SelectedNodeContext';
import { collectAllIds, findNodeById } from '../../utils/domParser';
import type { DomNode } from '../../types/dom.types';
import type { DataSource } from '../../hooks/useParsedDom.types';

interface StatusBarProps {
  rootNode: DomNode;
  source: DataSource;
}

export function StatusBar({ rootNode, source }: StatusBarProps) {
  const { selectedNodeId } = useSelectedNode();

  const nodeCount = collectAllIds(rootNode).length;
  const selectedNode = selectedNodeId ? findNodeById(rootNode, selectedNodeId) : null;
  const sourceLabel = source === 'sample' ? 'Sample data loaded' : 'Custom HTML loaded';

  return (
    <footer className="flex h-6 items-center justify-between border-t border-border bg-panel px-4">
      <span className="font-mono text-xs text-muted">
        {nodeCount} nodes
        {selectedNode && <> · Selected: &lt;{selectedNode.tagName}&gt;</>}
      </span>
      <span className="font-mono text-xs text-muted">{sourceLabel}</span>
    </footer>
  );
}