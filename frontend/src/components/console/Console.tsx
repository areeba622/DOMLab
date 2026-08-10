// src/components/console/Console.tsx
import { useMemo } from 'react';
import { analyzeTree } from '../../utils/analyzeDom';
import type { DomNode } from '../../types/dom.types';

interface ConsoleProps {
  rootNode: DomNode;
}

export function Console({ rootNode }: ConsoleProps) {
  // Re-run analysis only when the tree actually changes, not on every
  // unrelated re-render (e.g. selection changes elsewhere in the app).
  const messages = useMemo(() => analyzeTree(rootNode), [rootNode]);

  return (
    // -m-4 + h-full cancels Panel's own p-4 content padding, so this
    // dark terminal background bleeds all the way to the panel's
    // hard border on every side — not just a dark box floating
    // inside the normal panel padding.
    <div className="-m-4 flex h-full flex-col gap-1.5 overflow-auto bg-console-bg p-4">
      {messages.map((message) => (
        <p
          key={message.id}
          // text-shadow uses currentColor rather than a fixed green,
          // so success lines glow green and warning lines glow red —
          // each message type gets its own phosphor color instead of
          // everything being forced into one console-wide hue.
          className={[
            'font-mono text-xs [text-shadow:0_0_6px_currentColor]',
            message.type === 'warning' ? 'text-error' : 'text-console-text',
          ].join(' ')}
        >
          {message.type === 'warning' ? '⚠' : '✓'} {message.text}
        </p>
      ))}

      {/* Blinking cursor — reads as "still listening" after the last
          line. motion-safe: only applies the animation when the user
          hasn't requested reduced motion; it still renders as a
          solid (non-blinking) block otherwise rather than
          disappearing entirely. */}
      <span
        aria-hidden="true"
        className="inline-block h-3 w-1.5 bg-console-text [text-shadow:0_0_6px_currentColor] motion-safe:animate-[db-console-blink_1s_steps(2)_infinite]"
      />
    </div>
  );
}