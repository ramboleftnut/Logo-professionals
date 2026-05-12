import Link from "next/link";
import { notFound } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import { teamMembers as staticTeam } from "@/lib/data";
import PostForm from "../PostForm";

async function getTeam() {
  try {
    const snap = await adminDb.collection("team").orderBy("order", "asc").get();
    if (!snap.empty) return snap.docs.map((doc) => ({ id: doc.id, name: doc.data().name as string, slug: doc.data().slug as string }));
  } catch {}
  return staticTeam.map((m) => ({ id: m.slug, name: m.name, slug: m.slug }));
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [doc, team] = await Promise.all([
    adminDb.collection("posts").doc(id).get(),
    getTeam(),
  ]);
  if (!doc.exists) notFound();

  const d = doc.data()!;
  const post = {
    id: doc.id,
    title: d.title as string,
    slug: d.slug as string,
    excerpt: d.excerpt as string,
    content: d.content as string,
    thumbnail: d.thumbnail as string,
    gallery: (d.gallery ?? []) as string[],
    type: d.type as "blog" | "portfolio",
    designer: d.designer as string | null,
    tags: (d.tags ?? []) as string[],
    published: d.published as boolean,
  };

  return (
    <div className="admin-content">
      <Link href="/admin/posts" className="admin-back-link">← Blog & Portfolio</Link>
      <div className="admin-section-header">
        <h1 className="admin-section-title">Edit Post</h1>
        {post.published && (
          <Link
            href={post.type === "blog" ? `/blog/${post.slug}` : `/portfolio/${post.slug}`}
            target="_blank"
            className="admin-btn admin-btn-outline"
          >
            View Live ↗
          </Link>
        )}
      </div>
      <div className="admin-card">
        <PostForm initial={post} team={team} />
      </div>
    </div>
  );
}
