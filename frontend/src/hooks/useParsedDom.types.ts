// src/hooks/useParsedDom.types.ts
import type { DomNode } from '../types/dom.types';

export type DataSource = 'sample' | 'custom';

export interface ParsedDomState {
  tree: DomNode;
  source: DataSource;
  error: string | null;
  parseHtml: (html: string) => boolean;
  resetToSample: () => void;
}