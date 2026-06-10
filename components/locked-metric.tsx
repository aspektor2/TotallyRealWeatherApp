"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function Metric({
  label,
  value,
  unit,
  locked,
  lockedHint,
  onUnlock,
}: {
  label: string;
  value: string | number;
  unit?: string;
  locked: boolean;
  lockedHint?: string;
  onUnlock?: () => void;
}) {
  if (!locked) {
    return (
      <div className="rounded-xl border border-line bg-white/70 p-4">
        <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-mist">
          {label}
        </div>
        <div className="tabular mt-1.5 font-mono text-2xl font-medium text-ink">
          {value}
          {unit && (
            <span className="ml-1 text-sm font-normal text-slateink">
              {unit}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onUnlock}
      title={lockedHint}
      className={cn(
        "group relative w-full rounded-xl border border-line bg-white/70 p-4 text-left transition-all",
        "hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-mist">
          {label}
        </div>
        <Lock className="h-3.5 w-3.5 text-mist transition-colors group-hover:text-brand" />
      </div>
      <div
        className="redacted tabular mt-1.5 font-mono text-2xl font-medium text-ink"
        aria-hidden="true"
      >
        {value}
        {unit && (
          <span className="ml-1 text-sm font-normal text-slateink">{unit}</span>
        )}
      </div>
      <span className="sr-only">Locked. Requires Weather Premium.</span>
      <div className="mt-1 text-[11px] font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
        Unlock with Weather Premium™
      </div>
    </button>
  );
}
