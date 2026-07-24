// src/components/input/HtmlInputPanel.tsx
import { useState } from 'react';

interface HtmlInputPanelProps {
  isOpen: boolean;
  error: string | null;
  onParse: (html: string) => void;
  onReset: () => void;
  onClose: () => void;
}

export function HtmlInputPanel({ isOpen, error, onParse, onReset, onClose }: HtmlInputPanelProps) {
  const [draft, setDraft] = useState('');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Load your own HTML"
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-xl flex-col rounded border border-border bg-panel"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-sans text-sm font-semibold text-text">Load your own HTML</h2>
          <button onClick={onClose} aria-label="Close" className="text-muted hover:text-text">
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3 p-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Paste your own markup here..."
            rows={8}
            className="w-full resize-none rounded border border-border bg-background p-3 font-mono text-sm text-text outline-none focus:border-accentSecondary"
          />

          {error && (
            <p role="alert" className="font-sans text-sm text-error">
              ⚠ {error}
            </p>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={onReset}
              className="rounded border border-border px-3 py-2 font-sans text-xs text-muted transition-colors hover:text-text"
            >
              Reset to sample
            </button>

            <button
              onClick={() => onParse(draft)}
              className="rounded bg-accent px-4 py-2 font-sans text-xs font-semibold text-panel transition-opacity hover:opacity-90"
            >
              Parse HTML
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}