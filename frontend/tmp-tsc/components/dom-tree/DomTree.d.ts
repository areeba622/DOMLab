import type { DomNode } from '../../types/dom.types';
interface DomTreeProps {
    rootNode: DomNode;
    expandedIds: Set<string>;
    onToggleExpand: (id: string) => void;
}
export declare function DomTree({ rootNode, expandedIds, onToggleExpand }: DomTreeProps): import("react").JSX.Element;
export {};
