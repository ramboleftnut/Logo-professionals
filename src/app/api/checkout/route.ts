import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Payment tiers
const TIERS = {
  deposit: {
    amount: 6000, // $60.00 in cents (33% of $180)
    label: "Logo Design — 33% Deposit",
    description:
      "One concept + one revision. Remaining balance ($120) due on final approval.",
  },
  full: {
    amount: 18000, // $180.00 in cents
    label: "Logo Design — Full Payment",
    description:
      "Complete package: all revisions + vector source files (AI, EPS, PNG, PDF).",
  },
  remaining: {
    amount: 12000, // $120.00 in cents
    label: "Logo Design — Remaining Balance",
    description: "Final payment to receive vector source files and full delivery.",
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tier,
      name,
      email,
      companyName,
      industry,
      description,
      incorporate,
      logoName,
      avoid,
      colorPrefs,
      stylePrefs,
    } = body;

    if (!tier || !TIERS[tier as keyof typeof TIERS]) {
      return NextResponse.json(
        { error: "Invalid payment tier." },
        { status: 400 }
      );
    }

    const selectedTier = TIERS[tier as keyof typeof TIERS];

    const origin = req.headers.get("origin") ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: selectedTier.amount,
            product_data: {
              name: selectedTier.label,
              description: selectedTier.description,
              images: process.env.NEXT_PUBLIC_SITE_URL
                ? [`${process.env.NEXT_PUBLIC_SITE_URL}/images/stripe-product.jpg`]
                : [],
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        tier,
        client_name: name ?? "",
        client_email: email ?? "",
        company_name: companyName ?? "",
        industry: industry ?? "",
        description: (description ?? "").slice(0, 500),
        incorporate: (incorporate ?? "").slice(0, 500),
        logo_name: logoName ?? "",
        avoid: (avoid ?? "").slice(0, 500),
        color_prefs: colorPrefs ?? "",
        style_prefs: stylePrefs ?? "",
      },
      success_url: `${origin}/logo-design/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/logo-design/order/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
