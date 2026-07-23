// src/components/layout/ComingSoon.tsx

export function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center text-center">
      <p className="font-sans text-sm text-muted">{label} — coming in a future sprint</p>
    </div>
  );
}