import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amount,
      totalAmount,
      clientName,
      clientEmail,
      payOption,
      addBrandGuide,
      discount,
      couponApplied,
      order,
      websiteInfo,
      websiteTypeInfo,
      websitePagesInfo,
      websiteStyleInfo,
      websiteColorsInfo,
      websiteFontsInfo,
      websiteExtrasInfo,
      serviceType,
      fileMetadata,
    } = body;

    if (typeof amount !== "number" || amount < 1) {
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
    }

    const isWebsite = serviceType === "website" || websiteInfo !== undefined;
    const orderType = isWebsite ? "website" : (order?.serviceType === "redesign" ? "redesign" : "logo");

    const productName = isWebsite
      ? "Website Design"
      : orderType === "redesign"
        ? "Logo Redesign"
        : "Logo Design";

    const productDesc = payOption === "deposit"
      ? `33% deposit — remaining balance due before final delivery.`
      : `Full payment.`;

    const origin = req.headers.get("origin") ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: clientEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: `${productName} — ${payOption === "deposit" ? "Deposit" : "Full Payment"}`,
              description: productDesc,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        order_type: orderType,
        client_name: (clientName ?? "").slice(0, 100),
        client_email: (clientEmail ?? "").slice(0, 100),
        pay_option: payOption ?? "",
      },
      success_url: `${origin}/services/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/services/cancel`,
    });

    // Save the full order to Firestore (pending)
    const orderDoc: Record<string, unknown> = {
      type: orderType,
      status: "pending",
      stripeSessionId: session.id,
      clientName: clientName ?? "",
      clientEmail: clientEmail ?? "",
      companyName: isWebsite ? (websiteInfo?.companyName ?? "") : (order?.companyName ?? ""),
      payOption: payOption ?? "full",
      amount: Math.round(amount * 100),
      totalAmount: Math.round((totalAmount ?? amount) * 100),
      discount: discount ?? 0,
      couponApplied: !!couponApplied,
      fileMetadata: fileMetadata ?? null,
      createdAt: FieldValue.serverTimestamp(),
    };

    if (isWebsite) {
      orderDoc.websiteInfo = websiteInfo ?? {};
      orderDoc.websiteTypeInfo = websiteTypeInfo ?? {};
      orderDoc.websitePagesInfo = websitePagesInfo ?? {};
      orderDoc.websiteStyleInfo = websiteStyleInfo ?? {};
      orderDoc.websiteColorsInfo = websiteColorsInfo ?? {};
      orderDoc.websiteFontsInfo = websiteFontsInfo ?? {};
      orderDoc.websiteExtrasInfo = websiteExtrasInfo ?? {};
    } else {
      orderDoc.order = order ?? {};
      orderDoc.addBrandGuide = !!addBrandGuide;
    }

    await adminDb.collection("orders").add(orderDoc);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Create checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session." }, { status: 500 });
  }
}
