import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("session_id");
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!id || !secret) {
    return NextResponse.json({ paid: false }, { status: 400 });
  }
  try {
    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.retrieve(id);
    return NextResponse.json({ paid: session.payment_status === "paid" });
  } catch {
    return NextResponse.json({ paid: false }, { status: 400 });
  }
}
