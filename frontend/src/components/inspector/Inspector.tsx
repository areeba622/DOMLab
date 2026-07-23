// src/components/inspector/Inspector.tsx
import { useSelectedNode } from '../../context/SelectedNodeContext';
import { findNodeById } from '../../utils/domParser';
import { InspectorField } from './InspectorField';
import type { DomNode } from '../../types/dom.types';

interface InspectorProps {
  rootNode: DomNode;
}

export function Inspector({ rootNode }: InspectorProps) {
  const { selectedNodeId } = useSelectedNode();

  if (!selectedNodeId) {
    return (
      <p className="font-sans text-sm text-muted">
        Select a node to inspect it.
      </p>
    );
  }

  const node = findNodeById(rootNode, selectedNodeId);

  if (!node) {
    // Defensive case — shouldn't happen in practice, but a selected id
    // that no longer matches any node in the tree is a real possibility
    // once we support live/changing data in a later sprint.
    return (
      <p className="font-sans text-sm text-muted">
        Selected node not found.
      </p>
    );
  }

  const attributeEntries = Object.entries(node.attributes);

  return (
    <div className="flex flex-col">
      <InspectorField label="Tag" value={`<${node.tagName}>`} />
      <InspectorField label="Depth" value={String(node.depth)} />

      {node.textContent && (
        <InspectorField label="Text content" value={node.textContent} />
      )}

      {attributeEntries.length > 0 ? (
        attributeEntries.map(([key, value]) => (
          <InspectorField key={key} label={`Attribute: ${key}`} value={value} />
        ))
      ) : (
        <InspectorField label="Attributes" value="None" />
      )}
    </div>
  );
}