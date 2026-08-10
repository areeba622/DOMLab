// src/utils/domParser.ts
// Adapter file of our application (HTML/DOM nodes ko uthana aur unko aapke app ke custom format (DomNode) ma convert karna
//real browser element (using real DOM API properties like element.tagName, element.attributes, element.childNodes) and convert it into our made-up DomNode shape.

import type { DomNode } from '../types/dom.types';

let idCounter = 0;
function generateId(): string {
  idCounter += 1;
  return `node-${idCounter}`;
}

/**
 * Converts a real browser DOM element into our internal DomNode shape.
 * This is the ONLY place in the app that touches the actual DOM API —
 * every component downstream works with plain DomNode data, so this
 * function is what lets us swap the data source later (a live page,
 * an uploaded HTML file, etc.) without touching a single component.
 */
export function parseElement(element: Element, depth: number = 0): DomNode {
  const attributes: Record<string, string> = {};
  for (const attr of Array.from(element.attributes)) {
    attributes[attr.name] = attr.value;
  }

  const directText = Array.from(element.childNodes)
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent?.trim())
    .filter(Boolean)
    .join(' ');

  const childElements = Array.from(element.children).map((child) =>
    parseElement(child, depth + 1)
  );

  return {
    id: generateId(),
    tagName: element.tagName.toLowerCase(),
    attributes,
    textContent: directText || undefined,
    children: childElements,
    depth,
  };
}

/**
 * Hardcoded sample tree for Sprint 1 — lets the Tree and Inspector be
 * built and tested without needing a real page to parse yet. Written
 * by hand (not via parseElement) so ids stay stable across reloads.
 */
export function getSampleDomTree(): DomNode {
  return {
    id: 'root',
    tagName: 'html',
    attributes: {},
    children: [
      {
        id: 'head',
        tagName: 'head',
        attributes: {},
        children: [
          {
            id: 'title',
            tagName: 'title',
            attributes: {},
            textContent: 'DOMLab',
            children: [],
            depth: 2,
          },
        ],
        depth: 1,
      },
      {
        id: 'body',
        tagName: 'body',
        attributes: { class: 'app' },
        children: [
          {
            id: 'nav',
            tagName: 'nav',
            attributes: { class: 'navbar' },
            textContent: 'DOMLab',
            children: [],
            depth: 2,
          },
          {
            id: 'main',
            tagName: 'main',
            attributes: { class: 'content' },
            children: [
              {
                id: 'section-1',
                tagName: 'section',
                attributes: { id: 'tree-panel' },
                textContent: 'DOM Tree',
                children: [],
                depth: 3,
              },
              {
                id: 'section-2',
                tagName: 'section',
                attributes: { id: 'inspector-panel' },
                textContent: 'Inspector',
                children: [],
                depth: 3,
              },
            ],
            depth: 2,
          },
        ],
        depth: 1,
      },
    ],
    depth: 0,
  };
}

// src/utils/domParser.ts  (add this function to the existing file)

export function collectAllIds(node: DomNode): string[] {
  return [node.id, ...node.children.flatMap(collectAllIds)];
}

// src/utils/domParser.ts  (add this function)
//Simple recursive search — walk the tree, check each node, recurse into children if not found.
export function findNodeById(root: DomNode, id: string): DomNode | null {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

// src/utils/domParser.ts  (add to existing file)

export type ParseResult =
  | { success: true; tree: DomNode }
  | { success: false; error: string };

/**
 * Converts a raw HTML string (e.g. pasted by the user) into our
 * DomNode tree. Uses the browser's built-in DOMParser to turn the
 * string into real DOM elements first, then reuses parseElement —
 * the same function that would handle a live page — to do the
 * actual conversion. This is the ONLY new "touches the real DOM
 * API" boundary in Sprint 2; everything after this stays inside
 * our own DomNode world.
 */
// src/utils/domParser.ts — updated parseHtmlString
export function parseHtmlString(html: string): ParseResult {
  const trimmed = html.trim();

  if (!trimmed) {
    return { success: false, error: 'Please paste some HTML first.' };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(trimmed, 'text/html');

  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    return { success: false, error: 'Couldn\'t parse this as HTML. Check for unclosed tags and try again.' };
  }

  // If the user's input itself contains an <html> tag, they pasted a
  // full document — respect that, and use the REAL root (<html>),
  // preserving <head> and <body> exactly as authored.
  const isFullDocument = /<html[\s>]/i.test(trimmed);

  if (isFullDocument) {
    return { success: true, tree: parseElement(doc.documentElement) };
  }

  // Otherwise, this is a fragment/snippet paste — fall back to our
  // existing body-based logic.
  const rootElement = doc.body.children.length > 0 ? doc.body : null;

  if (!rootElement || rootElement.children.length === 0) {
    return { success: false, error: 'No valid HTML elements found in the input.' };
  }

  if (rootElement.children.length === 1) {
    return { success: true, tree: parseElement(rootElement.children[0]) };
  }

  const wrappedChildren = Array.from(rootElement.children).map((el) => parseElement(el, 1));

  return {
    success: true,
    tree: {
      id: 'parsed-root',
      tagName: '#fragment',
      attributes: {},
      children: wrappedChildren,
      depth: 0,
    },
  };
}

// src/utils/domParser.ts  (add this near the top, alongside other utilities)

// Elements browsers never render visually on the page itself —
// either they live in <head> and affect metadata/behavior, not
// layout, or they're structural-only. Used to give users a heads-up
// in the Inspector instead of leaving them wondering why nothing
// highlighted in Canvas.
const NON_VISUAL_TAGS = new Set([
  'head', 'title', 'meta', 'link', 'style', 'script', 'base', 'noscript',
]);

export function isNonVisualTag(tagName: string): boolean {
  return NON_VISUAL_TAGS.has(tagName);
}

// Add alongside NON_VISUAL_TAGS
const WHOLE_PAGE_TAGS = new Set(['html', 'body']);

export function isWholePageTag(tagName: string): boolean {
  return WHOLE_PAGE_TAGS.has(tagName);
}