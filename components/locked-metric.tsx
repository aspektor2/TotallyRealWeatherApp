"use client";

import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Eye,
  Sunrise,
  Sunset,
  CloudRain,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TileColor = "mint" | "blue" | "amber" | "pink" | "purple" | "coral";

const TILE: Record<TileColor, { bg: string; text: string }> = {
  mint: { bg: "bg-tile-mint", text: "text-tile-mintText" },
  blue: { bg: "bg-tile-blue", text: "text-tile-blueText" },
  amber: { bg: "bg-tile-amber", text: "text-tile-amberText" },
  pink: { bg: "bg-tile-pink", text: "text-tile-pinkText" },
  purple: { bg: "bg-tile-purple", text: "text-tile-purpleText" },
  coral: { bg: "bg-tile-coral", text: "text-tile-coralText" },
};

const ICONS: Record<string, LucideIcon> = {
  "Feels Like": Thermometer,
  Humidity: Droplets,
  "Wind Speed": Wind,
  "UV Index": Sun,
  Visibility: Eye,
  Sunrise: Sunrise,
  Sunset: Sunset,
  "Rain Probability": CloudRain,
};

export function Metric({
  label,
  value,
  unit,
  color,
  locked,
  onUnlock,
}: {
  label: string;
  value: string | number;
  unit?: string;
  color: TileColor;
  locked: boolean;
  onUnlock?: () => void;
}) {
  const t = TILE[color];
  const Icon = ICONS[label] ?? Sun;

  if (!locked) {
    return (
      <div className={cn("rounded-2xl p-4 text-center", t.bg)}>
        <Icon className={cn("mx-auto h-5 w-5", t.text)} aria-hidden="true" />
        <div className={cn("mt-1.5 text-xs font-bold", t.text)}>{label}</div>
        <div className="tabular mt-0.5 text-xl font-extrabold text-ink">
          {value}
          {unit && (
            <span className="ml-0.5 text-sm font-bold text-slateink">
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
      className={cn(
        "group rounded-2xl p-4 text-center transition-transform hover:-translate-y-0.5 hover:animate-wiggle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky",
        t.bg
      )}
    >
      <Lock className={cn("mx-auto h-5 w-5", t.text)} aria-hidden="true" />
      <div className={cn("mt-1.5 text-xs font-bold", t.text)}>{label}</div>
      <div className="mt-0.5 text-xl font-extrabold text-ink" aria-hidden="true">
        ???
      </div>
      <span className="sr-only">Locked. Tap to unlock with Weather Premium.</span>
    </button>
  );
}
