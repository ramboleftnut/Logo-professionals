import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const BRANDING_TIERS = {
  logo_only: { amount: 18000, label: "Logo Design", description: "Custom logo + vector source files." },
  logo_brand: { amount: 45000, label: "Logo + Brand Identity", description: "Logo, color palette, typography, brand guidelines PDF." },
  full_brand: { amount: 90000, label: "Full Branding Package", description: "Complete brand identity: logo, guidelines, business card, letterhead, social kit." },
  redesign: { amount: 15000, label: "Logo Redesign", description: "Modernize your existing logo." },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tier, clientName, clientEmail, companyName, industry, tagline,
      description, services, styles, colorPrefs, notes,
    } = body;

    if (!tier || !BRANDING_TIERS[tier as keyof typeof BRANDING_TIERS]) {
      return NextResponse.json({ error: "Invalid tier." }, { status: 400 });
    }

    const selected = BRANDING_TIERS[tier as keyof typeof BRANDING_TIERS];
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
        order_type: "branding",
        tier,
        client_name: clientName ?? "",
        client_email: clientEmail ?? "",
        company_name: companyName ?? "",
      },
      success_url: `${origin}/branding-order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/branding-order/cancel`,
    });

    await adminDb.collection("orders").add({
      type: "branding",
      status: "pending",
      stripeSessionId: session.id,
      tier,
      clientName: clientName ?? "",
      clientEmail: clientEmail ?? "",
      companyName: companyName ?? "",
      industry: industry ?? "",
      tagline: tagline ?? "",
      description: description ?? "",
      services: services ?? [],
      styles: styles ?? [],
      colorPrefs: colorPrefs ?? "",
      notes: notes ?? "",
      amount: selected.amount,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Branding checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout." }, { status: 500 });
  }
}
