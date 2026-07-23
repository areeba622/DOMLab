// src/context/SelectedNodeContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { SelectedNodeContextValue } from './selection.types';

const SelectedNodeContext = createContext<SelectedNodeContextValue | undefined>(undefined);

export function SelectedNodeProvider({ children }: { children: ReactNode }) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectNode = (id: string) => {
    setSelectedNodeId(id);
  };

  const clearSelection = () => {
    setSelectedNodeId(null);
  };

  return (
    <SelectedNodeContext.Provider value={{ selectedNodeId, selectNode, clearSelection }}>
      {children}
    </SelectedNodeContext.Provider>
  );
}

export function useSelectedNode(): SelectedNodeContextValue {
  const context = useContext(SelectedNodeContext);
  if (!context) {
    throw new Error('useSelectedNode must be used within a SelectedNodeProvider');
  }
  return context;
}