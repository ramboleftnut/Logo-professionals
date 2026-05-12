import Link from "next/link";
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

export default async function NewPostPage() {
  const team = await getTeam();
  return (
    <div className="admin-content">
      <Link href="/admin/posts" className="admin-back-link">← Blog & Portfolio</Link>
      <div className="admin-section-header">
        <h1 className="admin-section-title">New Post</h1>
      </div>
      <div className="admin-card">
        <PostForm team={team} />
      </div>
    </div>
  );
}
