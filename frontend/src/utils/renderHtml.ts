// src/utils/renderHtml.ts
import type { DomNode } from '../types/dom.types';

// Elements that can never have children or a closing tag. Missing
// this list would make something like <img> silently swallow every
// element after it as if it were a child — breaking the whole
// rendered page in a way that's hard to spot just by reading code.
const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img',
  'input', 'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function serializeNode(node: DomNode): string {
  // #fragment is our own synthetic wrapper (Sprint 2) — it was never
  // real HTML, so skip straight to its children rather than trying
  // to render a <#fragment> tag, which isn't valid markup at all.
  if (node.tagName === '#fragment') {
    return node.children.map(serializeNode).join('');
  }

  const attrs = Object.entries(node.attributes)
    .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
    .join(' ');

  // data-domlab-id is OUR marker, invisible to the user, that lets
  // LivePreview match a rendered element back to its DomNode —
  // this is the thread the whole Canvas ↔ Tree sync depends on.
  const idAttr = `data-domlab-id="${node.id}"`;
  const openTag = `<${node.tagName} ${idAttr}${attrs ? ' ' + attrs : ''}>`;

  if (VOID_ELEMENTS.has(node.tagName)) {
    return openTag;
  }

  const text = node.textContent ? escapeText(node.textContent) : '';
  const childrenHtml = node.children.map(serializeNode).join('');

  return `${openTag}${text}${childrenHtml}</${node.tagName}>`;
}

export function renderHtml(rootNode: DomNode): string {
  return `<!DOCTYPE html>
<html>
<head>
<style>
  /* Ours, not the user's — safe to inject directly.
     This is what makes selection visible inside the iframe. */
  .domlab-selected {
    outline: 2px solid #E8A33D;
    outline-offset: 1px;
  }
  body {
    font-family: system-ui, sans-serif;
    margin: 12px;
  }
    html, body {
  width: 100%;
  min-height: 100%;
  margin: 0;
}
body {
  padding: 12px;
  box-sizing: border-box;
}
</style>
</head>
<body>${serializeNode(rootNode)}</body>
</html>`;
}