import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // "blog" | "portfolio" | null (all)
  const designer = searchParams.get("designer");
  const published = searchParams.get("published");

  let query: FirebaseFirestore.Query = adminDb.collection("posts");

  if (type) query = query.where("type", "==", type);
  if (designer) query = query.where("designer", "==", designer);
  if (published === "true") query = query.where("published", "==", true);

  query = query.orderBy("createdAt", "desc");
  const snap = await query.get();

  const posts = snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      ...d,
      createdAt: d.createdAt?.toDate?.()?.toISOString() ?? null,
      updatedAt: d.updatedAt?.toDate?.()?.toISOString() ?? null,
    };
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    title, slug, excerpt, content, thumbnail, gallery,
    type, designer, tags, published,
  } = body;

  if (!title || !slug || !type) {
    return NextResponse.json({ error: "title, slug, and type are required." }, { status: 400 });
  }

  const doc = await adminDb.collection("posts").add({
    title,
    slug,
    excerpt: excerpt ?? "",
    content: content ?? "",
    thumbnail: thumbnail ?? "",
    gallery: gallery ?? [],
    type,
    designer: designer ?? null,
    tags: tags ?? [],
    published: published ?? false,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ id: doc.id });
}
