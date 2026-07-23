// src/components/layout/StatusBar.tsx  (updated)
import { useSelectedNode } from '../../context/SelectedNodeContext';
import { collectAllIds, findNodeById } from '../../utils/domParser';
import type { DomNode } from '../../types/dom.types';

interface StatusBarProps {
  rootNode: DomNode;
}

export function StatusBar({ rootNode }: StatusBarProps) {
  const { selectedNodeId } = useSelectedNode();

  const nodeCount = collectAllIds(rootNode).length;
  const selectedNode = selectedNodeId ? findNodeById(rootNode, selectedNodeId) : null;

  return (
    <footer className="flex h-6 items-center border-t border-border bg-panel px-4">
      <span className="font-mono text-xs text-muted">
        {nodeCount} nodes
        {selectedNode && <> · Selected: &lt;{selectedNode.tagName}&gt;</>}
      </span>
    </footer>
  );
}