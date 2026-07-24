export interface SelectedNodeContextValue {
    selectedNodeId: string | null;
    selectNode: (id: string) => void;
    clearSelection: () => void;
}
