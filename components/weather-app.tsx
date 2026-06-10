"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CloudSun,
  Loader2,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Metric } from "@/components/locked-metric";
import { PaywallModal } from "@/components/paywall-modal";
import { WeatherIcon } from "@/components/weather-icon";
import { TIERS, type Tier, type WeatherPayload } from "@/lib/tiers";
import { cn } from "@/lib/utils";

const S1 = "ewc_tier1";
const S2 = "ewc_tier2";

// Decoy values shown (blurred) behind the paywall. Never the real data.
const DECOY = {
  feelsLike: 74,
  humidity: 48,
  wind: 7,
  uv: 6,
  visibility: 10,
  sunrise: "5:43 AM",
  sunset: "8:11 PM",
  pop: 20,
};

export function WeatherApp() {
  const router = useRouter();
  const params = useSearchParams();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherPayload | null>(null);

  const [tier1, setTier1] = useState(false);
  const [tier2, setTier2] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTier, setModalTier] = useState<Tier>(1);

  // Restore session unlocks
  useEffect(() => {
    setTier1(sessionStorage.getItem(S1) === "1");
    setTier2(sessionStorage.getItem(S2) === "1");
  }, []);

  const unlock = useCallback((tier: Tier) => {
    if (tier === 1) {
      sessionStorage.setItem(S1, "1");
      setTier1(true);
    } else {
      sessionStorage.setItem(S2, "1");
      setTier2(true);
    }
  }, []);

  const search = useCallback(
    async (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/weather?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Unable to retrieve enterprise weather assets.");
          setWeather(null);
        } else {
          setWeather(data);
        }
      } catch {
        setError(
          "Unable to retrieve enterprise weather assets. Please try again later."
        );
        setWeather(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Handle return from Stripe Checkout
  useEffect(() => {
    const sessionId = params.get("session_id");
    const tierParam = params.get("tier") === "2" ? 2 : 1;
    const q = params.get("q");
    if (q) {
      setQuery(q);
      search(q);
    }
    if (sessionId) {
      fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.paid) unlock(tierParam as Tier);
        })
        .finally(() => router.replace("/", { scroll: false }));
    } else if (params.get("canceled")) {
      router.replace("/", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openPaywall(tier: Tier) {
    setModalTier(tier);
    setModalOpen(true);
  }

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24">
      {/* Nav */}
      <header className="flex items-center justify-between py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white">
            <CloudSun className="h-5 w-5" />
          </div>
          <span className="font-display text-[15px] font-semibold tracking-tight">
            Enterprise Weather Company™
          </span>
        </div>
        <div className="hidden items-center gap-2 text-xs font-medium text-mist sm:flex">
          <ShieldCheck className="h-4 w-4" />
          Trusted by over 3 Fortune 500 companies
        </div>
      </header>

      {/* Hero */}
      <section
        className={cn(
          "mx-auto max-w-2xl text-center transition-all",
          weather ? "pt-6 pb-10" : "pt-20 pb-16 sm:pt-28"
        )}
      >
        {!weather && (
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-line bg-white/70 px-3.5 py-1.5 text-xs font-medium text-slateink backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            Weather intelligence at scale
          </div>
        )}
        <h1
          className={cn(
            "font-display font-semibold tracking-tight text-ink",
            weather ? "text-2xl" : "text-4xl leading-[1.1] sm:text-5xl"
          )}
        >
          {weather
            ? "Your enterprise weather assets"
            : "Enterprise-grade weather solutions for modern organizations."}
        </h1>
        {!weather && (
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slateink">
            Real-time atmospheric analytics, delivered through a
            procurement-friendly access model. Future weather is expensive to
            manufacture.
          </p>
        )}

        <form
          className="mx-auto mt-8 flex max-w-md gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            search(query);
          }}
        >
          <div className="relative flex-1">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter ZIP code or City, State"
              className="pl-10"
              aria-label="Enter ZIP code or City, State"
            />
          </div>
          <Button size="lg" type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Retrieve Weather™ <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
        {error && (
          <p className="mx-auto mt-4 max-w-md rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {!weather && !error && (
          <p className="mt-4 text-xs text-mist">
            Try 10001 · Austin, TX · Philadelphia, PA
          </p>
        )}
      </section>

      {/* Results */}
      {weather && (
        <div className="space-y-6">
          {weather.demo && (
            <p className="rounded-xl border border-line bg-white/70 px-4 py-2.5 text-center text-xs text-mist">
              Demo data shown — no weather API key is configured on this
              deployment.
            </p>
          )}

          {/* Current conditions */}
          <Card className="animate-rise p-7 sm:p-9">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-slateink">
                  <MapPin className="h-4 w-4" /> {weather.location}
                </div>
                <div className="tabular mt-2 font-display text-7xl font-semibold tracking-tight text-ink sm:text-8xl">
                  {weather.temp}°
                  <span className="text-3xl font-medium text-mist sm:text-4xl">
                    F
                  </span>
                </div>
                <div className="mt-1 text-lg text-slateink">
                  {weather.conditions}
                </div>
              </div>
              <WeatherIcon
                code={weather.icon}
                className="h-24 w-24 text-brand sm:h-28 sm:w-28"
              />
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-ink">
                  Atmospheric details
                </h2>
                {!tier1 && (
                  <button
                    onClick={() => openPaywall(1)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md"
                  >
                    <Lock className="h-3 w-3" /> Weather Premium™ ·{" "}
                    {TIERS[1].priceLabel}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <Metric
                  label="Feels Like"
                  value={tier1 ? `${weather.feelsLike}°` : `${DECOY.feelsLike}°`}
                  locked={!tier1}
                  lockedHint="Premium humidity insights available."
                  onUnlock={() => openPaywall(1)}
                />
                <Metric
                  label="Humidity"
                  value={tier1 ? weather.humidity : DECOY.humidity}
                  unit="%"
                  locked={!tier1}
                  lockedHint="Premium humidity insights available."
                  onUnlock={() => openPaywall(1)}
                />
                <Metric
                  label="Wind Speed"
                  value={tier1 ? weather.windSpeed : DECOY.wind}
                  unit="mph"
                  locked={!tier1}
                  lockedHint="Wind speed requires a Weather Premium™ subscription."
                  onUnlock={() => openPaywall(1)}
                />
                <Metric
                  label="UV Index"
                  value={tier1 ? weather.uvIndex : DECOY.uv}
                  locked={!tier1}
                  lockedHint="Unlock enhanced meteorological visibility."
                  onUnlock={() => openPaywall(1)}
                />
                <Metric
                  label="Visibility"
                  value={tier1 ? weather.visibility : DECOY.visibility}
                  unit="mi"
                  locked={!tier1}
                  lockedHint="Unlock enhanced meteorological visibility."
                  onUnlock={() => openPaywall(1)}
                />
              </div>
            </div>
          </Card>

          {/* Forecast — Tier 2 */}
          <Card className="animate-rise p-7 sm:p-9 [animation-delay:120ms]">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                  Forecast
                </h2>
                <p className="mt-0.5 text-sm text-slateink">
                  Future weather is expensive to manufacture.
                </p>
              </div>
              {!tier2 && (
                <Button size="sm" onClick={() => openPaywall(2)}>
                  <Lock className="h-3.5 w-3.5" />
                  Enterprise Forecast Suite™ · {TIERS[2].priceLabel}
                </Button>
              )}
            </div>

            <LockedSection locked={!tier2} onUnlock={() => openPaywall(2)}>
              {/* Hourly */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {(tier2 ? weather.hourly : decoyHourly()).map((h, i) => (
                  <div
                    key={i}
                    className="flex min-w-[72px] flex-col items-center rounded-xl border border-line bg-white/70 px-3 py-3.5"
                  >
                    <span className="text-[11px] font-medium text-mist">
                      {h.time}
                    </span>
                    <WeatherIcon
                      code={h.icon}
                      className="my-2 h-6 w-6 text-brand"
                    />
                    <span className="tabular font-mono text-sm font-medium text-ink">
                      {h.temp}°
                    </span>
                  </div>
                ))}
              </div>

              {/* Daily */}
              <div className="mt-5 divide-y divide-line rounded-xl border border-line bg-white/70">
                {(tier2 ? weather.daily : decoyDaily()).map((d, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[3.5rem_1.5rem_1fr_auto] items-center gap-4 px-4 py-3"
                  >
                    <span className="text-sm font-medium text-ink">{d.day}</span>
                    <WeatherIcon code={d.icon} className="h-5 w-5 text-brand" />
                    <span className="text-xs text-slateink">
                      {d.pop > 30 ? `${d.pop}% chance of rain` : "Low rain probability"}
                    </span>
                    <span className="tabular font-mono text-sm">
                      <span className="font-medium text-ink">{d.hi}°</span>
                      <span className="ml-2 text-mist">{d.lo}°</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Sun + rain */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                <Metric
                  label="Sunrise"
                  value={tier2 ? weather.sunrise : DECOY.sunrise}
                  locked={false}
                />
                <Metric
                  label="Sunset"
                  value={tier2 ? weather.sunset : DECOY.sunset}
                  locked={false}
                />
                <Metric
                  label="Rain Probability"
                  value={tier2 ? weather.rainProbability : DECOY.pop}
                  unit="%"
                  locked={false}
                />
              </div>
            </LockedSection>
          </Card>

          {/* Corporate nonsense strip */}
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              "Enterprise-grade atmospheric analytics.",
              "Unlock enhanced meteorological visibility.",
              "Premium humidity insights available.",
            ].map((line) => (
              <div
                key={line}
                className="rounded-xl border border-line bg-white/60 px-4 py-3 text-center text-xs font-medium text-slateink backdrop-blur"
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-24 border-t border-line pt-8 text-center text-xs text-mist">
        <p className="font-medium text-slateink">Enterprise Weather Company™</p>
        <p className="mt-1.5">Trusted by over 3 Fortune 500 companies.</p>
        <p className="mt-1.5">Weather data may be weather.</p>
      </footer>

      <PaywallModal
        open={modalOpen}
        tier={modalTier}
        location={weather?.location || query}
        onOpenChange={setModalOpen}
        onUnlock={unlock}
      />
    </div>
  );
}

function LockedSection({
  locked,
  onUnlock,
  children,
}: {
  locked: boolean;
  onUnlock: () => void;
  children: React.ReactNode;
}) {
  if (!locked) return <>{children}</>;
  return (
    <div className="relative">
      <div className="redacted" aria-hidden="true">
        {children}
      </div>
      <button
        type="button"
        onClick={onUnlock}
        className="absolute inset-0 flex items-center justify-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        aria-label="Unlock forecast with Enterprise Forecast Suite"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/90 px-5 py-2.5 text-sm font-medium text-ink shadow-card backdrop-blur">
          <Lock className="h-4 w-4 text-brand" />
          Future forecasting is part of our Enterprise Forecast Suite™
        </span>
      </button>
    </div>
  );
}

function decoyHourly() {
  const hours = ["Now", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM"];
  return hours.map((time, i) => ({
    time,
    temp: 71 + ((i * 3) % 5),
    icon: i % 3 === 2 ? "02d" : "01d",
    pop: 0,
  }));
}

function decoyDaily() {
  const days = ["Today", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
  return days.map((day, i) => ({
    day,
    hi: 75 - (i % 4),
    lo: 60 - (i % 3),
    icon: i % 3 === 1 ? "10d" : "01d",
    pop: i % 3 === 1 ? 60 : 10,
  }));
}
