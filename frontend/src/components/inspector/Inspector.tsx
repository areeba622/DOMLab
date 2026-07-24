// src/components/inspector/Inspector.tsx  (updated)
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
    return (
      <p className="font-sans text-sm text-muted">
        Selected node not found.
      </p>
    );
  }

  if (node.tagName === '#fragment') {
    return (
      <div className="flex flex-col gap-2">
        <p className="font-sans text-sm text-text">
          This isn't a real HTML tag.
        </p>
        <p className="font-sans text-sm text-muted">
          Your pasted HTML had {node.children.length} separate top-level
          elements with no single shared parent, so DOMLab grouped them
          under this placeholder to display them as one tree. Select one
          of its child nodes below to inspect real HTML.
        </p>
      </div>
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