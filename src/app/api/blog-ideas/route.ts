import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createBlogIdea, getBlogIdeas } from "@/lib/content";

const PROD_DISABLED = { error: "Blog ideas can only be edited locally. Edit JSON in repo and commit." };

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ideas = await getBlogIdeas();
  return NextResponse.json(ideas);
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") return NextResponse.json(PROD_DISABLED, { status: 403 });

  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const idea = await createBlogIdea({
    title,
    description: typeof body.description === "string" ? body.description : "",
    socialMedia: Array.isArray(body.socialMedia) ? body.socialMedia.filter((item: unknown) => typeof item === "string") : [],
    images: Array.isArray(body.images) ? body.images.filter((item: unknown) => typeof item === "string") : [],
  });

  return NextResponse.json({ id: idea.id });
}
