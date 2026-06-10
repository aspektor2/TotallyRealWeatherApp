import { Suspense } from "react";
import { WeatherApp } from "@/components/weather-app";

export default function Home() {
  return (
    <main>
      <Suspense fallback={null}>
        <WeatherApp />
      </Suspense>
    </main>
  );
}
