"use client";

const COLORS = ["#58CC02", "#1CB0F6", "#FFC800", "#FF6FA5", "#CE82FF"];

export function Confetti() {
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    left: (i * 37) % 100,
    delay: (i % 6) * 0.08,
    color: COLORS[i % COLORS.length],
    size: 6 + (i % 3) * 3,
  }));
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-36 overflow-hidden"
      aria-hidden="true"
    >
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 block motion-safe:animate-confetti rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
