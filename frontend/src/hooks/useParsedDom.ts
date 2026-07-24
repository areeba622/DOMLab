// src/hooks/useParsedDom.ts
import { useState } from 'react';
import { getSampleDomTree, parseHtmlString } from '../utils/domParser';
import type { ParsedDomState, DataSource } from './useParsedDom.types';
import type { DomNode } from '../types/dom.types';

export function useParsedDom(): ParsedDomState {
  const [tree, setTree] = useState<DomNode>(() => getSampleDomTree());
  const [source, setSource] = useState<DataSource>('sample');
  const [error, setError] = useState<string | null>(null);

  // src/hooks/useParsedDom.ts — updated parseHtml
  const parseHtml = (html: string): boolean => {
    const result = parseHtmlString(html);

    if (!result.success) {
      setError(result.error);
      return false;
    }

    setTree(result.tree);
    setSource('custom');
    setError(null);
    return true;
  };

  const resetToSample = () => {
    setTree(getSampleDomTree());
    setSource('sample');
    setError(null);
  };

  return { tree, source, error, parseHtml, resetToSample };
}