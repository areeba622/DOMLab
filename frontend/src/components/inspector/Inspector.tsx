// src/components/inspector/Inspector.tsx  (updated)
import { useSelectedNode } from '../../context/SelectedNodeContext';
import type { DomNode } from '../../types/dom.types';
import { findNodeById, isNonVisualTag, isWholePageTag } from '../../utils/domParser';
import { InspectorField } from './InspectorField';

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
  const isNonVisual = isNonVisualTag(node.tagName);
  const isWholePage = isWholePageTag(node.tagName);

  return (
    <div className="flex flex-col">
      {isNonVisual && (
        <div className="mb-2 border-2 border-dashed border-accentSecondary bg-background px-3 py-2">
          <p className="font-sans text-xs text-muted">
            ℹ Browsers don't display <span className="font-mono">&lt;{node.tagName}&gt;</span> on
            the page itself — that's why nothing highlights in the Canvas.
          </p>
        </div>
      )}

      {isWholePage && (
        <div className="mb-2 border-2 border-dashed border-accentSecondary bg-background px-3 py-2">
          <p className="font-sans text-xs text-muted">
            ℹ This wraps the entire page — the highlight outlines all visible content at once,
            which can look like a thin line at the edges.
          </p>
        </div>
      )}

      {/* accent: links this value visually back to the amber
          highlight on the selected node in the Tree panel. */}
      <InspectorField label="Tag" value={`<${node.tagName}>`} accent />
      <InspectorField label="Depth" value={String(node.depth)} />
      {node.textContent && (
        <InspectorField label="Text content" value={node.textContent} />
      )}

      {attributeEntries.length > 0 ? (
        attributeEntries.map(([key, value]) => (
          <InspectorField key={key} label={`Attribute: ${key}`} value={value} />
        ))
      ) : (
        <InspectorField label="Attributes" value="—" muted />
      )}
    </div>
  );
}