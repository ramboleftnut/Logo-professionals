import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Find the order by session ID and mark it paid
    const snap = await adminDb
      .collection("orders")
      .where("stripeSessionId", "==", session.id)
      .limit(1)
      .get();

    if (!snap.empty) {
      await snap.docs[0].ref.update({
        status: "paid",
        paidAt: FieldValue.serverTimestamp(),
        stripePaymentIntentId: session.payment_intent,
        amountPaid: session.amount_total,
      });
    }
  }

  return NextResponse.json({ received: true });
}
