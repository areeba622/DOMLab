// src/utils/analyzeDom.ts
import type { DomNode } from '../types/dom.types';
import type { ConsoleMessage } from '../components/console/console.types';
import { collectAllIds } from './domParser';

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `msg-${idCounter}`;
}

function walkTags(node: DomNode, tagName: string, results: DomNode[] = []): DomNode[] {
  if (node.tagName === tagName) results.push(node);
  node.children.forEach((child) => walkTags(child, tagName, results));
  return results;
}

/**
 * Runs a fixed set of lightweight structural checks against the
 * current tree and returns a list of findings. Deliberately simple —
 * these are meant to be genuinely educational nudges, not a full
 * accessibility audit tool. Each check is independent and additive,
 * so adding a new one later is a small, isolated change.
 */
export function analyzeTree(root: DomNode): ConsoleMessage[] {
  const messages: ConsoleMessage[] = [];

  // Always report a successful parse first — this is the baseline
  // "everything worked" confirmation, regardless of what else we find.
  const nodeCount = collectAllIds(root).length;
  messages.push({
    id: nextId(),
    type: 'success',
    text: `Parsed successfully — ${nodeCount} node${nodeCount === 1 ? '' : 's'}`,
  });

  // Check: <img> missing "alt"
  const images = walkTags(root, 'img');
  const imagesMissingAlt = images.filter((img) => !('alt' in img.attributes));
  if (imagesMissingAlt.length > 0) {
    messages.push({
      id: nextId(),
      type: 'warning',
      text: `${imagesMissingAlt.length} <img> element${imagesMissingAlt.length === 1 ? '' : 's'} missing an "alt" attribute`,
    });
  }

  // Check: multiple <h1> elements
  const h1s = walkTags(root, 'h1');
  if (h1s.length > 1) {
    messages.push({
      id: nextId(),
      type: 'warning',
      text: `${h1s.length} <h1> elements found — pages typically have one`,
    });
  }

  // Check: <button> with no visible text and no aria-label
  const buttons = walkTags(root, 'button');
  const emptyButtons = buttons.filter(
    (btn) => !btn.textContent?.trim() && !('aria-label' in btn.attributes)
  );
  if (emptyButtons.length > 0) {
    messages.push({
      id: nextId(),
      type: 'warning',
      text: `${emptyButtons.length} <button> element${emptyButtons.length === 1 ? '' : 's'} with no visible text or aria-label`,
    });
  }

  return messages;
}