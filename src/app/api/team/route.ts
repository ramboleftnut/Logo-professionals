import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET() {
  const snap = await adminDb.collection("team").orderBy("order", "asc").get();
  const members = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, slug, role, bio, quote, image, heroBg, instagram, website, order } = body;

  if (!name || !slug || !role) {
    return NextResponse.json({ error: "name, slug, and role are required." }, { status: 400 });
  }

  const doc = await adminDb.collection("team").add({
    name, slug, role, bio: bio ?? "", quote: quote ?? "",
    image: image ?? "", heroBg: heroBg ?? "",
    instagram: instagram ?? "", website: website ?? null,
    order: order ?? 99,
    createdAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ id: doc.id });
}
