// src/components/inspector/InspectorField.tsx

interface InspectorFieldProps {
  label: string;
  value: string;
  /** Tag field uses this — visually links Inspector back to the
      amber-highlighted node selected in the Tree. */
  accent?: boolean;
  /** Empty-state placeholders (e.g. "—" for no attributes) — quieter
      than the default text color, distinct from an actual value. */
  muted?: boolean;
}

// Long values (text content, verbose attribute strings) can't use an
// inline label-leader-value row without wrapping awkwardly, so they
// drop into a stacked layout instead. Short scalar values (tag,
// depth) stay inline.
const LONG_VALUE_THRESHOLD = 28;

export function InspectorField({ label, value, accent, muted }: InspectorFieldProps) {
  const isLong = value.length > LONG_VALUE_THRESHOLD;

  const valueClass = [
    'break-words font-mono text-sm',
    accent ? 'font-bold text-accent' : muted ? 'text-muted' : 'text-text',
    isLong ? '' : 'text-right',
  ].join(' ');

  return (
    <div className="border-b border-dashed border-border py-2 last:border-b-0">
      <div className={isLong ? 'flex flex-col gap-0.5' : 'flex items-baseline justify-between gap-3'}>
        <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-wide text-muted">
          {label}
        </span>
        <span className={valueClass}>{value}</span>
      </div>
    </div>
  );
}