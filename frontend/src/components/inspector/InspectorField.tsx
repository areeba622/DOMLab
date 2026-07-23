// src/components/inspector/InspectorField.tsx

interface InspectorFieldProps {
  label: string;
  value: string;
}

export function InspectorField({ label, value }: InspectorFieldProps) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border py-2 last:border-b-0">
      <span className="font-sans text-xs font-medium text-muted uppercase tracking-wide">
        {label}
      </span>
      <span className="font-mono text-sm text-text">{value}</span>
    </div>
  );
}