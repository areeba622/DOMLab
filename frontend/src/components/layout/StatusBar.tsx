// src/components/layout/StatusBar.tsx
import { useSelectedNode } from '../../context/SelectedNodeContext';
import { collectAllIds, findNodeById } from '../../utils/domParser';
import type { DomNode } from '../../types/dom.types';
import type { DataSource } from '../../hooks/useParsedDom.types';

interface StatusBarProps {
  rootNode: DomNode;
  source: DataSource;
}

// Shared ticker-segment styling: static by default, thin accent
// underline appears only on hover — no motion, no layout shift
// (the transparent border reserves the space up front).
const tickerSegment =
  'border-b-2 border-transparent pb-px transition-colors hover:border-accent hover:text-accent';

export function StatusBar({ rootNode, source }: StatusBarProps) {
  const { selectedNodeId } = useSelectedNode();

  const nodeCount = collectAllIds(rootNode).length;
  const selectedNode = selectedNodeId ? findNodeById(rootNode, selectedNodeId) : null;
  const sourceLabel = source === 'sample' ? 'Sample data loaded' : 'Custom HTML loaded';

  return (
    <footer className="flex h-7 items-center justify-between border-t-[2.5px] border-line bg-panel px-4 font-mono text-xs uppercase tracking-wide text-muted">
      <div className="flex items-center gap-4">
        <span className={tickerSegment}>{nodeCount} nodes</span>
        {selectedNode && (
          <span className={tickerSegment}>selected: &lt;{selectedNode.tagName}&gt;</span>
        )}
      </div>
      <span className={tickerSegment}>{sourceLabel}</span>
    </footer>
  );
}