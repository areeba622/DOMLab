// src/types/dom.types.ts

/**
 * Our internal representation of a DOM node — NOT the real browser
 * DOM object. We convert real/sample DOM into this shape so every
 * component only ever has to think about one simple, predictable
 * structure, regardless of where the data originally came from.
 */
export interface DomNode {
  /** Stable unique id — used for React keys, selection, and expand state */
  id: string;

  /** e.g. "div", "span", "section" — always lowercase, matching HTML convention */
  tagName: string;

  /** e.g. { class: "container", id: "main" } — empty object if none */
  attributes: Record<string, string>;

  /** Visible text directly inside this node (not inside children). Optional — many nodes have none. */
  textContent?: string;

  /** Nested child nodes — empty array for leaf nodes, never undefined */
  children: DomNode[];

  /** How deep this node sits in the tree — root is 0. Used for indentation. */
  depth: number;
}