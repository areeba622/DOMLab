// src/hooks/useDomTree.ts
//This owns "which nodes are expanded" — lives outside the component itself so DomTree stays a bit leaner, and so this logic is testable on its own.
import { useState } from 'react';
import type { TreeExpansionState } from './useDomTree.types';

export function useDomTree(initiallyExpandedIds: string[] = []): TreeExpansionState {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(initiallyExpandedIds) // set
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

//Why a Set instead of an array or object: 
// checking "is this id expanded" happens on every single node 
// on every render (expandedIds.has(id)). A Set does that check
//  in constant time regardless of how many nodes exist, whereas 
// an array would have to scan through every entry each time — 
// a real difference once trees get deep.