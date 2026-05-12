import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const WEBSITE_TIERS = {
  landing: { amount: 50000, label: "Landing Page", description: "Single-page website — perfect for launches and promos." },
  multi_page: { amount: 80000, label: "Multi-Page Website", description: "Up to 6 pages: Home, About, Services, Portfolio, Blog, Contact." },
  ecommerce: { amount: 120000, label: "E-Commerce Website", description: "Online store with product listings, cart, and secure checkout." },
  custom: { amount: 150000, label: "Custom / Enterprise", description: "Complex requirements — custom quote after discovery call." },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tier, clientName, clientEmail, companyName,
      websiteType, description, pages, style, features, colorPrefs, notes,
    } = body;

    if (!tier || !WEBSITE_TIERS[tier as keyof typeof WEBSITE_TIERS]) {
      return NextResponse.json({ error: "Invalid tier." }, { status: 400 });
    }

    const selected = WEBSITE_TIERS[tier as keyof typeof WEBSITE_TIERS];
    const origin = req.headers.get("origin") ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: clientEmail || undefined,
      line_items: [{
        price_data: {
          currency: "usd",
          unit_amount: selected.amount,
          product_data: { name: selected.label, description: selected.description },
        },
        quantity: 1,
      }],
      metadata: {
        order_type: "website",
        tier,
        client_name: clientName ?? "",
        client_email: clientEmail ?? "",
        company_name: companyName ?? "",
      },
      success_url: `${origin}/website-order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/website-order/cancel`,
    });

    await adminDb.collection("orders").add({
      type: "website",
      status: "pending",
      stripeSessionId: session.id,
      tier,
      clientName: clientName ?? "",
      clientEmail: clientEmail ?? "",
      companyName: companyName ?? "",
      websiteType: websiteType ?? "",
      description: description ?? "",
      pages: pages ?? [],
      style: style ?? "",
      features: features ?? [],
      colorPrefs: colorPrefs ?? "",
      notes: notes ?? "",
      amount: selected.amount,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Website checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout." }, { status: 500 });
  }
}
