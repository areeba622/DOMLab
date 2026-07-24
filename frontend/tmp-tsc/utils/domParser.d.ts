import type { DomNode } from '../types/dom.types';
/**
 * Converts a real browser DOM element into our internal DomNode shape.
 * This is the ONLY place in the app that touches the actual DOM API —
 * every component downstream works with plain DomNode data, so this
 * function is what lets us swap the data source later (a live page,
 * an uploaded HTML file, etc.) without touching a single component.
 */
export declare function parseElement(element: Element, depth?: number): DomNode;
/**
 * Hardcoded sample tree for Sprint 1 — lets the Tree and Inspector be
 * built and tested without needing a real page to parse yet. Written
 * by hand (not via parseElement) so ids stay stable across reloads.
 */
export declare function getSampleDomTree(): DomNode;
export declare function collectAllIds(node: DomNode): string[];
export declare function findNodeById(root: DomNode, id: string): DomNode | null;
export type ParseResult = {
    success: true;
    tree: DomNode;
} | {
    success: false;
    error: string;
};
/**
 * Converts a raw HTML string (e.g. pasted by the user) into our
 * DomNode tree. Uses the browser's built-in DOMParser to turn the
 * string into real DOM elements first, then reuses parseElement —
 * the same function that would handle a live page — to do the
 * actual conversion. This is the ONLY new "touches the real DOM
 * API" boundary in Sprint 2; everything after this stays inside
 * our own DomNode world.
 */
export declare function parseHtmlString(html: string): ParseResult;
