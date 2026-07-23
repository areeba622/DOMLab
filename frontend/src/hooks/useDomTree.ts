// src/hooks/useDomTree.ts
import { useState } from 'react';
import type { TreeExpansionState } from './useDomTree.types';

export function useDomTree(initiallyExpandedIds: string[] = []): TreeExpansionState {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(initiallyExpandedIds)
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = (allIds: string[]) => {
    setExpandedIds(new Set(allIds));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  return { expandedIds, toggleExpand, expandAll, collapseAll };
}