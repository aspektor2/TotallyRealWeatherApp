# Enterprise Weather Company™

Enterprise-grade weather solutions for modern organizations. Trusted by over 3 Fortune 500 companies. Weather data may be weather.

A satirical weather site: real weather data, completely serious premium SaaS design, and almost everything useful locked behind absurd paywalls.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn-style components (Radix) · Stripe Checkout · OpenWeather

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in keys (see below)
npm run dev
```

Open http://localhost:3000 and search `10001` or `Austin, TX`.

## Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `OPENWEATHER_API_KEY` | For real weather | Free tier at openweathermap.org. Without it, the site serves clearly-labeled demo data so everything still works. |
| `STRIPE_SECRET_KEY` | For real payments | Use a **test key** (`sk_test_...`) unless you genuinely intend to charge people $999.99 for humidity. Without it, Purchase Now shows a friendly error nudging people toward the discount code. |
| `NEXT_PUBLIC_BASE_URL` | For Stripe redirects | e.g. `https://your-app.vercel.app`. Falls back to the request origin. |

## How the unlocks work

- **Tier 1 — Weather Premium™ ($999.99):** Feels Like, Humidity, Wind Speed, UV Index, Visibility.
- **Tier 2 — Enterprise Forecast Suite™ ($4,999.99):** hourly forecast, tomorrow, 7-day, sunrise, sunset, rain probability.
- **Discount code:** `UNEMPLOYED` zeroes out the total; the buyer must still click Complete Purchase. Unlocks without touching Stripe.
- **Watch an ad:** searches ~3 seconds, finds no advertisements, tells you to pick another option, buddy. No unlock.
- **Sell your data:** big textarea, fake confirmation screen, unlocks the tier. Nothing typed is stored, sent, or logged — the field is cleared client-side on submit, and a visible note on the form says so (important since this deploys publicly).
- **Contact sales:** consultations are booking 14–18 months out. No unlock.

Unlocks live in `sessionStorage` and expire with the browser session. No accounts, no login.

Locked metrics render **decoy values** behind the blur, not the real data — devtools archaeologists get nothing.

## Stripe notes

- Checkout sessions are created server-side in `app/api/checkout/route.ts` with inline `price_data`, so you don't need to create Products in the Stripe dashboard.
- After payment, Stripe redirects back with `session_id`; `app/api/checkout/verify` confirms `payment_status === "paid"` before unlocking.
- In test mode, pay with card `4242 4242 4242 4242`, any future expiry, any CVC.

## Deploy to Vercel

```bash
npx vercel
```

Then add the three environment variables in the Vercel project settings and redeploy. Set `NEXT_PUBLIC_BASE_URL` to your production URL so Stripe redirects land in the right place.

## Implementation notes

- ZIP codes geocode via OpenWeather's `geo/1.0/zip` (US); `City, State` via `geo/1.0/direct`.
- Current conditions come from `data/2.5/weather`; the forecast aggregates the free `data/2.5/forecast` (3-hour steps) into hourly and daily views.
- The free tier doesn't expose UV index, so it's estimated from cloud cover and time of day. Weather accuracy not guaranteed. All sales final.
