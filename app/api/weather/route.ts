import { NextRequest, NextResponse } from "next/server";
import type { WeatherPayload, HourlyPoint, DailyPoint } from "@/lib/tiers";

const OWM = "https://api.openweathermap.org";

function fmtTime(unix: number, tzOffsetSec: number) {
  const d = new Date((unix + tzOffsetSec) * 1000);
  let h = d.getUTCHours();
  const m = d.getUTCMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function fmtHour(unix: number, tzOffsetSec: number) {
  const d = new Date((unix + tzOffsetSec) * 1000);
  let h = d.getUTCHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h} ${ampm}`;
}

function fmtDay(unix: number, tzOffsetSec: number) {
  const d = new Date((unix + tzOffsetSec) * 1000);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()];
}

// OpenWeather's free tier doesn't expose UV, so we estimate from cloud
// cover and time of day. Accuracy not guaranteed. All sales final.
function estimateUv(clouds: number, unix: number, tzOffsetSec: number) {
  const h = new Date((unix + tzOffsetSec) * 1000).getUTCHours();
  const solar = Math.max(0, Math.sin(((h - 6) / 12) * Math.PI)); // 0 at 6am/6pm, 1 at noon
  return Math.round(10 * solar * (1 - clouds / 130));
}

function demoPayload(label: string): WeatherPayload {
  const hours = ["Now", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM"];
  const days = ["Today", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
  return {
    demo: true,
    location: label || "New York, NY",
    temp: 72,
    conditions: "Sunny",
    icon: "01d",
    feelsLike: 74,
    humidity: 48,
    windSpeed: 7,
    uvIndex: 6,
    visibility: 10,
    sunrise: "5:42 AM",
    sunset: "8:19 PM",
    rainProbability: 10,
    hourly: hours.map((time, i) => ({
      time,
      temp: 72 + Math.round(3 * Math.sin(i / 2)),
      icon: i < 5 ? "01d" : "02d",
      pop: i < 5 ? 0 : 10,
    })),
    daily: days.map((day, i) => ({
      day,
      hi: 76 - i,
      lo: 61 - i,
      icon: i % 3 === 2 ? "10d" : "01d",
      pop: i % 3 === 2 ? 55 : 5,
    })),
  };
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (!q) {
    return NextResponse.json(
      { error: "We were unable to locate that weather." },
      { status: 400 }
    );
  }

  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    // No API key configured: serve demo data so the experience still works.
    return NextResponse.json(demoPayload(q.match(/^\d{5}$/) ? "New York, NY" : titleCase(q)));
  }

  try {
    // 1) Geocode: ZIP or "City, State"
    let lat: number, lon: number, label: string;
    if (/^\d{5}$/.test(q)) {
      const r = await fetch(`${OWM}/geo/1.0/zip?zip=${q},US&appid=${key}`, {
        cache: "no-store",
      });
      if (!r.ok) throw new Error("not_found");
      const g = await r.json();
      lat = g.lat;
      lon = g.lon;
      label = g.name;
    } else {
      const parts = q.split(",").map((s: string) => s.trim());
      const query =
        parts.length >= 2 ? `${parts[0]},${parts[1]},US` : `${parts[0]}`;
      const r = await fetch(
        `${OWM}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${key}`,
        { cache: "no-store" }
      );
      if (!r.ok) throw new Error("not_found");
      const arr = await r.json();
      if (!arr?.length) {
        return NextResponse.json(
          { error: "We were unable to locate that weather." },
          { status: 404 }
        );
      }
      lat = arr[0].lat;
      lon = arr[0].lon;
      label = arr[0].state
        ? `${arr[0].name}, ${arr[0].state}`
        : `${arr[0].name}, ${arr[0].country}`;
    }

    // 2) Current conditions + 5-day / 3-hour forecast (both free tier)
    const [curRes, fcRes] = await Promise.all([
      fetch(
        `${OWM}/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`,
        { cache: "no-store" }
      ),
      fetch(
        `${OWM}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`,
        { cache: "no-store" }
      ),
    ]);
    if (!curRes.ok || !fcRes.ok) throw new Error("upstream");
    const cur = await curRes.json();
    const fc = await fcRes.json();
    const tz: number = cur.timezone ?? 0;

    const hourly: HourlyPoint[] = (fc.list as any[]).slice(0, 8).map((p, i) => ({
      time: i === 0 ? "Now" : fmtHour(p.dt, tz),
      temp: Math.round(p.main.temp),
      icon: p.weather?.[0]?.icon ?? "01d",
      pop: Math.round((p.pop ?? 0) * 100),
    }));

    // Group 3-hour points into days for a 5–7 day outlook
    const byDay = new Map<string, any[]>();
    for (const p of fc.list as any[]) {
      const dayKey = new Date((p.dt + tz) * 1000).toISOString().slice(0, 10);
      if (!byDay.has(dayKey)) byDay.set(dayKey, []);
      byDay.get(dayKey)!.push(p);
    }
    const daily: DailyPoint[] = [...byDay.entries()].slice(0, 7).map(
      ([, points], i) => {
        const temps = points.map((p) => p.main.temp);
        const mid = points[Math.floor(points.length / 2)];
        return {
          day: i === 0 ? "Today" : fmtDay(points[0].dt, tz),
          hi: Math.round(Math.max(...temps)),
          lo: Math.round(Math.min(...temps)),
          icon: mid.weather?.[0]?.icon ?? "01d",
          pop: Math.round(Math.max(...points.map((p) => p.pop ?? 0)) * 100),
        };
      }
    );

    const payload: WeatherPayload = {
      demo: false,
      location: label,
      temp: Math.round(cur.main.temp),
      conditions: titleCase(cur.weather?.[0]?.description ?? "Clear"),
      icon: cur.weather?.[0]?.icon ?? "01d",
      feelsLike: Math.round(cur.main.feels_like),
      humidity: cur.main.humidity,
      windSpeed: Math.round(cur.wind?.speed ?? 0),
      uvIndex: estimateUv(cur.clouds?.all ?? 0, cur.dt, tz),
      visibility: Math.round((cur.visibility ?? 10000) / 1609),
      sunrise: fmtTime(cur.sys.sunrise, tz),
      sunset: fmtTime(cur.sys.sunset, tz),
      rainProbability: hourly[0]?.pop ?? 0,
      hourly,
      daily,
    };
    return NextResponse.json(payload);
  } catch (e: any) {
    if (e?.message === "not_found") {
      return NextResponse.json(
        { error: "We were unable to locate that weather." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Unable to retrieve enterprise weather assets. Please try again later." },
      { status: 502 }
    );
  }
}

function titleCase(s: string) {
  return s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1));
}
