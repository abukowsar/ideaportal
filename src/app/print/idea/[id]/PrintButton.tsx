"use client";

export default function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" className="btn btn-green btn-sm" onClick={() => window.print()}>
      {label}
    </button>
  );
}
