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
export declare function DomTreeNode({ node, isExpanded, isSelected, expandedIds, selectedNodeId, onToggleExpand, onSelect, }: DomTreeNodeProps): import("react").JSX.Element;
export {};
