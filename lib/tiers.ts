export type Tier = 1 | 2;

export const TIERS: Record<
  Tier,
  { name: string; price: number; priceLabel: string; blurb: string; unlocks: string[] }
> = {
  1: {
    name: "Weather Premium™",
    price: 99999, // cents
    priceLabel: "$999.99",
    blurb: "Unlock enhanced meteorological visibility for the current session.",
    unlocks: ["Feels Like", "Humidity", "Wind Speed", "UV Index", "Visibility"],
  },
  2: {
    name: "Enterprise Forecast Suite™",
    price: 499999, // cents
    priceLabel: "$4,999.99",
    blurb: "Future weather is expensive to manufacture.",
    unlocks: [
      "Hourly Forecast",
      "Tomorrow's Weather",
      "7-Day Forecast",
      "Sunrise",
      "Sunset",
      "Rain Probability",
    ],
  },
};

export const DISCOUNT_CODE = "UNEMPLOYED";

export interface HourlyPoint {
  time: string; // e.g. "3 PM"
  temp: number;
  icon: string;
  pop: number; // rain probability 0-100
}

export interface DailyPoint {
  day: string; // e.g. "Thu"
  hi: number;
  lo: number;
  icon: string;
  pop: number;
}

export interface WeatherPayload {
  demo: boolean;
  location: string;
  temp: number;
  conditions: string;
  icon: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number; // mph
  uvIndex: number;
  visibility: number; // miles
  sunrise: string;
  sunset: string;
  rainProbability: number; // 0-100
  hourly: HourlyPoint[];
  daily: DailyPoint[];
}
