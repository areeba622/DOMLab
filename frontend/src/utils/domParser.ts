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

export function findNodeById(root: DomNode, id: string): DomNode | null {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}