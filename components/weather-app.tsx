"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Lock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Metric } from "@/components/locked-metric";
import { PaywallModal } from "@/components/paywall-modal";
import { WeatherIcon } from "@/components/weather-icon";
import { Drizzle, SpeechBubble } from "@/components/drizzle";
import { TIERS, type Tier, type WeatherPayload } from "@/lib/tiers";
import { cn } from "@/lib/utils";

const S1 = "trwa_tier1";
const S2 = "trwa_tier2";

const DRIZZLE_LINES = [
  "Humidity is my favorite secret! Wanna buy it?",
  "I'd tell you the wind speed, but my lawyer said no.",
  "Future weather is expensive to manufacture. I should know — I make it.",
  "Fun fact: the UV index exists. That info was free. The number isn't.",
  "Premium humidity insights available. I'm so excited for you.",
];

export function WeatherApp() {
  const router = useRouter();
  const params = useSearchParams();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherPayload | null>(null);
  const [line, setLine] = useState(0);

  const [tier1, setTier1] = useState(false);
  const [tier2, setTier2] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTier, setModalTier] = useState<Tier>(1);

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

  const search = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to retrieve totally real weather assets.");
        setWeather(null);
      } else {
        setWeather(data);
        setLine(Math.floor(Math.random() * DRIZZLE_LINES.length));
      }
    } catch {
      setError(
        "Unable to retrieve totally real weather assets. Please try again later."
      );
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const unlockedCount = (tier1 ? 5 : 0) + (tier2 ? 6 : 0);

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24">
      {/* Nav */}
      <header className="flex items-center justify-between py-6">
        <div className="flex items-center gap-2.5">
          <Drizzle mood="happy" className="h-12 w-14" animate={false} />
          <span className="font-display text-lg font-extrabold tracking-tight">
            Totally Real Weather App™
          </span>
        </div>
        <div className="hidden items-center gap-2 text-xs font-bold text-mist sm:flex">
          Trusted by over 3 Fortune 500 companies
        </div>
      </header>

      {/* Hero */}
      <section
        className={cn(
          "mx-auto max-w-2xl text-center transition-all",
          weather ? "pt-4 pb-8" : "pt-16 pb-14 sm:pt-24"
        )}
      >
        {!weather && (
          <>
            <Drizzle mood="happy" className="mx-auto h-28 w-32" />
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              Real weather.
              <br />
              <span className="text-sky">Really expensive.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base font-semibold leading-relaxed text-slateink">
              Totally real weather data for totally real people. Meet Drizzle,
              our Chief Revenue Cloud. He knows the humidity. He&apos;s not
              telling. Yet.
            </p>
          </>
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
              placeholder="ZIP code or City, State"
              className="rounded-2xl border-2 pl-10 font-bold"
              aria-label="Enter ZIP code or City, State"
            />
          </div>
          <Button size="md" variant="sky" type="submit" disabled={loading} className="h-12">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Get Weather™ <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
        {error && (
          <p className="mx-auto mt-4 max-w-md rounded-2xl border-2 border-tile-pink bg-tile-pink p-3 text-sm font-bold text-tile-pinkText">
            {error}
          </p>
        )}
        {!weather && !error && (
          <p className="mt-4 text-xs font-bold text-mist">
            Try 10001 · Austin, TX · Philadelphia, PA
          </p>
        )}
      </section>

      {/* Results */}
      {weather && (
        <div className="space-y-6">
          {weather.demo && (
            <p className="rounded-2xl border-2 border-line bg-white px-4 py-2.5 text-center text-xs font-bold text-mist">
              Demo data shown — no weather API key is configured on this
              deployment.
            </p>
          )}

          {/* Current conditions */}
          <Card className="animate-rise p-7 sm:p-9">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-slateink">
                  <MapPin className="h-4 w-4" /> {weather.location}
                </div>
                <div className="tabular mt-2 font-display text-7xl font-extrabold tracking-tight text-ink sm:text-8xl">
                  {weather.temp}°
                  <span className="text-3xl font-bold text-mist sm:text-4xl">F</span>
                </div>
                <div className="mt-1 text-lg font-bold text-slateink">
                  {weather.conditions}
                </div>
              </div>
              <WeatherIcon
                code={weather.icon}
                className="h-24 w-24 text-sky sm:h-28 sm:w-28"
              />
            </div>

            {/* Drizzle commentary */}
            <div className="mt-6 flex items-center gap-2">
              <Drizzle mood={tier1 ? "happy" : "guard"} className="h-16 w-20 shrink-0" />
              <SpeechBubble className="flex-1">
                {tier1
                  ? "Look at you, a premium weather knower. I'm so proud."
                  : DRIZZLE_LINES[line]}
              </SpeechBubble>
            </div>

            <div className="mt-6 border-t-2 border-line pt-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-extrabold text-ink">
                  Weather insights{" "}
                  <span className="font-bold text-mist">
                    · {unlockedCount} of 11 unlocked
                  </span>
                </h2>
                {!tier1 && (
                  <button
                    onClick={() => openPaywall(1)}
                    className="inline-flex items-center gap-1.5 rounded-md text-xs font-extrabold text-sky hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky"
                  >
                    <Lock className="h-3 w-3" /> Weather Premium™ ·{" "}
                    {TIERS[1].priceLabel}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <Metric
                  label="Feels Like"
                  value={`${weather.feelsLike}°`}
                  color="mint"
                  locked={!tier1}
                  onUnlock={() => openPaywall(1)}
                />
                <Metric
                  label="Humidity"
                  value={weather.humidity}
                  unit="%"
                  color="blue"
                  locked={!tier1}
                  onUnlock={() => openPaywall(1)}
                />
                <Metric
                  label="Wind Speed"
                  value={weather.windSpeed}
                  unit="mph"
                  color="purple"
                  locked={!tier1}
                  onUnlock={() => openPaywall(1)}
                />
                <Metric
                  label="UV Index"
                  value={weather.uvIndex}
                  color="amber"
                  locked={!tier1}
                  onUnlock={() => openPaywall(1)}
                />
                <Metric
                  label="Visibility"
                  value={weather.visibility}
                  unit="mi"
                  color="pink"
                  locked={!tier1}
                  onUnlock={() => openPaywall(1)}
                />
              </div>
            </div>
          </Card>

          {/* Forecast — Tier 2 */}
          <Card className="animate-rise p-7 sm:p-9 [animation-delay:120ms]">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-extrabold tracking-tight text-ink">
                  The Future™
                </h2>
                <p className="mt-0.5 text-sm font-bold text-slateink">
                  Future weather is expensive to manufacture.
                </p>
              </div>
              {!tier2 && (
                <Button size="sm" onClick={() => openPaywall(2)}>
                  <Lock className="h-3.5 w-3.5" />
                  Unlock · {TIERS[2].priceLabel}
                </Button>
              )}
            </div>

            {tier2 ? (
              <>
                {/* Hourly */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {weather.hourly.map((h, i) => (
                    <div
                      key={i}
                      className="flex min-w-[72px] flex-col items-center rounded-2xl border-2 border-line bg-white px-3 py-3.5"
                    >
                      <span className="text-[11px] font-extrabold text-mist">
                        {h.time}
                      </span>
                      <WeatherIcon code={h.icon} className="my-2 h-6 w-6 text-sky" />
                      <span className="tabular text-sm font-extrabold text-ink">
                        {h.temp}°
                      </span>
                    </div>
                  ))}
                </div>

                {/* Daily */}
                <div className="mt-5 divide-y-2 divide-line rounded-2xl border-2 border-line bg-white">
                  {weather.daily.map((d, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[3.5rem_1.5rem_1fr_auto] items-center gap-4 px-4 py-3"
                    >
                      <span className="text-sm font-extrabold text-ink">{d.day}</span>
                      <WeatherIcon code={d.icon} className="h-5 w-5 text-sky" />
                      <span className="text-xs font-bold text-slateink">
                        {d.pop > 30
                          ? `${d.pop}% chance of rain`
                          : "Low rain probability"}
                      </span>
                      <span className="tabular text-sm font-extrabold">
                        <span className="text-ink">{d.hi}°</span>
                        <span className="ml-2 text-mist">{d.lo}°</span>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <Metric label="Sunrise" value={weather.sunrise} color="amber" locked={false} />
                  <Metric label="Sunset" value={weather.sunset} color="coral" locked={false} />
                  <Metric
                    label="Rain Probability"
                    value={weather.rainProbability}
                    unit="%"
                    color="blue"
                    locked={false}
                  />
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={() => openPaywall(2)}
                className="flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-line bg-cloud px-6 py-10 text-center transition-colors hover:border-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky"
              >
                <Drizzle mood="guard" className="h-24 w-28" />
                <p className="mt-4 font-display text-lg font-extrabold text-ink">
                  Drizzle is standing on the forecast.
                </p>
                <p className="mt-1 max-w-sm text-sm font-bold text-slateink">
                  Tomorrow&apos;s weather, the 7-day outlook, sunrise, sunset,
                  and rain probability are part of the Enterprise Forecast
                  Suite™. He will move for {TIERS[2].priceLabel}.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-leaf px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white border-b-4 border-leaf-edge">
                  <Lock className="h-4 w-4" /> Unlock The Future™
                </span>
              </button>
            )}
          </Card>

          {/* Nonsense strip */}
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              "Enterprise-grade atmospheric analytics.",
              "Unlock enhanced meteorological visibility.",
              "Premium humidity insights available.",
            ].map((l) => (
              <div
                key={l}
                className="rounded-2xl border-2 border-line bg-white px-4 py-3 text-center text-xs font-bold text-slateink"
              >
                {l}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-24 border-t-2 border-line pt-8 text-center text-xs font-bold text-mist">
        <p className="text-slateink">Totally Real Weather App™</p>
        <p className="mt-1.5">Trusted by over 3 Fortune 500 companies.</p>
        <p className="mt-1.5">Weather data may be weather.</p>
        <p className="mt-1.5">Drizzle is not a meteorologist.</p>
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
