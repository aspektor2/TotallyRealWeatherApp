import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { TIERS, type Tier } from "@/lib/tiers";

export async function POST(req: NextRequest) {
  const { tier, location } = (await req.json()) as {
    tier: Tier;
    location?: string;
  };
  const t = TIERS[tier];
  if (!t) {
    return NextResponse.json({ error: "Unknown tier." }, { status: 400 });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      {
        error:
          "Payments are not configured on this deployment. Try the discount code — we hear UNEMPLOYED works.",
      },
      { status: 503 }
    );
  }

  const stripe = new Stripe(secret);
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    req.nextUrl.origin ||
    "http://localhost:3000";

  const params = new URLSearchParams();
  if (location) params.set("q", location);
  params.set("tier", String(tier));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: t.price,
          product_data: {
            name: t.name,
            description:
              "Session-scoped weather intelligence. Weather accuracy not guaranteed. All sales final.",
          },
        },
      },
    ],
    success_url: `${base}/?${params.toString()}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/?${params.toString()}&canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
