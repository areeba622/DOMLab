// src/components/canvas/LivePreview.tsx
import { useEffect, useRef } from 'react';
import { renderHtml } from '../../utils/renderHtml';
import { useSelectedNode } from '../../context/SelectedNodeContext';
import type { DomNode } from '../../types/dom.types';

interface LivePreviewProps {
  rootNode: DomNode;
}

export function LivePreview({ rootNode }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { selectedNodeId, selectNode } = useSelectedNode();

  // Regenerate and reload the iframe's content whenever the tree changes
  // (new custom HTML parsed, or reset to sample).
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    iframe.srcdoc = renderHtml(rootNode);
  }, [rootNode]);

  // Every reload replaces the iframe's ENTIRE internal document, so any
  // listener we attached before is gone too — we have to re-attach fresh
  // after every load, and re-apply whatever highlight was already active.
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

          const handleClick = (event: MouseEvent) => {
        // FIXED: only block the browser's default behavior for real
        // links. Previously this ran unconditionally on every click,
        // which also cancelled native non-JS interactive behaviors —
        // <details>/<summary> toggling, checkbox/radio toggling, etc.
        // — since those are technically the browser's "default
        // action" for a click too. Scoping this to just <a href>
        // keeps link-navigation blocked (the actual goal) without
        // breaking everything else that happens to rely on the
        // browser's built-in click behavior.
        const anchor = (event.target as HTMLElement).closest('a[href]');
        if (anchor) {
          event.preventDefault();
        }


        const target = (event.target as HTMLElement).closest('[data-domlab-id]');
        if (target) {
          selectNode(target.getAttribute('data-domlab-id')!);
        }
      };

      doc.addEventListener('click', handleClick);
      applyHighlight(doc, selectedNodeId);
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
    // Deliberately depends on rootNode too — a reload means a brand new
    // document, so this whole setup needs to re-run alongside it, not
    // just once on mount.
  }, [rootNode, selectNode, selectedNodeId]);

  // Handles the OTHER direction: selection changed because the user
  // clicked a row in the Tree panel, not something inside the iframe.
  // No reload needed here — just move the highlight class.
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (doc) applyHighlight(doc, selectedNodeId);
  }, [selectedNodeId]);

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-same-origin"
      title="Live HTML preview"
      className="h-full w-full border-0 bg-white/50"
    />
  );
}

function applyHighlight(doc: Document, selectedNodeId: string | null) {
  doc.querySelectorAll('.domlab-selected').forEach((el) => {
    el.classList.remove('domlab-selected');
  });

  if (!selectedNodeId) return;

  doc.querySelector(`[data-domlab-id="${selectedNodeId}"]`)?.classList.add('domlab-selected');
}