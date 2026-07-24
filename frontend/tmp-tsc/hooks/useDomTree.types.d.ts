export interface TreeExpansionState {
    expandedIds: Set<string>;
    toggleExpand: (id: string) => void;
    expandAll: (allIds: string[]) => void;
    collapseAll: () => void;
}
