import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { deleteBlogIdea, getBlogIdea, updateBlogIdea } from "@/lib/content";

const PROD_DISABLED = { error: "Blog ideas can only be edited locally. Edit JSON in repo and commit." };

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const idea = await getBlogIdea(id);
  if (!idea) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(idea);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (process.env.NODE_ENV === "production") return NextResponse.json(PROD_DISABLED, { status: 403 });

  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  if (typeof body.title === "string" && !body.title.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const patch: Parameters<typeof updateBlogIdea>[1] = {};
  if (typeof body.title === "string") patch.title = body.title.trim();
  if (typeof body.description === "string") patch.description = body.description;
  if (Array.isArray(body.socialMedia)) patch.socialMedia = body.socialMedia.filter((item: unknown) => typeof item === "string");
  if (Array.isArray(body.images)) patch.images = body.images.filter((item: unknown) => typeof item === "string");

  const updated = await updateBlogIdea(id, patch);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (process.env.NODE_ENV === "production") return NextResponse.json(PROD_DISABLED, { status: 403 });

  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const ok = await deleteBlogIdea(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
