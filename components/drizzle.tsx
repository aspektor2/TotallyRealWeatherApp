import { cn } from "@/lib/utils";

export type Mood = "happy" | "guard" | "sad" | "party";

/**
 * Drizzle, Chief Revenue Cloud. Moods:
 *  happy — default smile
 *  guard — stern brows, guarding the paywall
 *  sad   — frown + a single tear (no ads available)
 *  party — open-mouth grin (purchase success)
 */
export function Drizzle({
  mood = "happy",
  className,
  animate = true,
}: {
  mood?: Mood;
  className?: string;
  animate?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 100"
      role="img"
      aria-label={`Drizzle the cloud mascot, looking ${mood}`}
      className={cn(animate && "motion-safe:animate-float", className)}
    >
      {/* body */}
      <ellipse cx="60" cy="62" rx="44" ry="26" fill="#BFE3FB" />
      <circle cx="38" cy="48" r="20" fill="#BFE3FB" />
      <circle cx="66" cy="40" r="25" fill="#BFE3FB" />
      <circle cx="90" cy="52" r="16" fill="#BFE3FB" />

      {/* brows (guard only) */}
      {mood === "guard" && (
        <>
          <line x1="45" y1="46" x2="57" y2="50" stroke="#1B4C76" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="83" y1="46" x2="71" y2="50" stroke="#1B4C76" strokeWidth="3.5" strokeLinecap="round" />
        </>
      )}

      {/* eyes */}
      {mood === "sad" ? (
        <>
          <path d="M48 54 Q52 58 56 55" stroke="#1B4C76" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M72 55 Q76 58 80 54" stroke="#1B4C76" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          {/* tear */}
          <path d="M80 62 q4 6 0 9 q-4 -3 0 -9" fill="#1CB0F6" />
        </>
      ) : (
        <>
          <circle cx="52" cy="55" r="4.5" fill="#1B4C76" />
          <circle cx="76" cy="55" r="4.5" fill="#1B4C76" />
        </>
      )}

      {/* mouth */}
      {mood === "happy" && (
        <path d="M54 68 Q64 76 74 68" stroke="#1B4C76" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}
      {mood === "guard" && (
        <line x1="56" y1="70" x2="72" y2="70" stroke="#1B4C76" strokeWidth="3.5" strokeLinecap="round" />
      )}
      {mood === "sad" && (
        <path d="M54 72 Q64 65 74 72" stroke="#1B4C76" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}
      {mood === "party" && (
        <path d="M52 66 Q64 80 76 66 Z" fill="#1B4C76" />
      )}

      {/* blush */}
      {mood !== "guard" && (
        <>
          <circle cx="42" cy="64" r="4" fill="#FFC2D4" />
          <circle cx="86" cy="64" r="4" fill="#FFC2D4" />
        </>
      )}
    </svg>
  );
}

export function SpeechBubble({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border-2 border-line bg-white px-4 py-3 text-sm font-bold text-ink",
        className
      )}
    >
      {children}
      <span
        className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-line bg-white"
        aria-hidden="true"
      />
    </div>
  );
}
