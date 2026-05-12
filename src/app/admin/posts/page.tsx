import Link from "next/link";
import Image from "next/image";
import { adminDb } from "@/lib/firebase/admin";
import DeletePostBtn from "./DeletePostBtn";

interface Post {
  id: string;
  title: string;
  slug: string;
  type: string;
  designer: string | null;
  thumbnail: string;
  published: boolean;
  createdAt: FirebaseFirestore.Timestamp | null;
}

async function getPosts() {
  const snap = await adminDb.collection("posts").orderBy("createdAt", "desc").get();
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Post, "id">),
  }));
}

function formatDate(ts: FirebaseFirestore.Timestamp | null) {
  if (!ts) return "—";
  return ts.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function AdminPostsPage() {
  const posts = await getPosts().catch(() => [] as Post[]);

  const blog = posts.filter((p) => p.type === "blog");
  const portfolio = posts.filter((p) => p.type === "portfolio");

  return (
    <div className="admin-content">
      <div className="admin-section-header">
        <h1 className="admin-section-title">Blog & Portfolio</h1>
        <Link href="/admin/posts/new" className="admin-btn admin-btn-primary">+ New Post</Link>
      </div>

      {posts.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">📝</div>
          <div className="admin-empty-text">No posts yet. Create your first one.</div>
        </div>
      ) : (
        <>
          {blog.length > 0 && (
            <>
              <h2 className="admin-table-section-label">Blog Posts ({blog.length})</h2>
              <div className="admin-table-wrap admin-table-wrap--spaced">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {blog.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="admin-table-cell-stack">
                            {p.thumbnail && (
                              <div className="admin-table-thumb">
                                <Image src={p.thumbnail} alt="" fill style={{ objectFit: "cover" }} unoptimized />
                              </div>
                            )}
                            <span className="primary">{p.title}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`admin-badge ${p.published ? "admin-badge-green" : "admin-badge-gray"}`}>
                            {p.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td>{formatDate(p.createdAt)}</td>
                        <td>
                          <div className="admin-row-actions">
                            <Link href={`/admin/posts/${p.id}`} className="admin-btn admin-btn-outline admin-btn-sm">Edit</Link>
                            <DeletePostBtn id={p.id} title={p.title} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {portfolio.length > 0 && (
            <>
              <h2 className="admin-table-section-label">Portfolio Items ({portfolio.length})</h2>
              <div className="admin-posts-grid">
                {portfolio.map((p) => (
                  <div key={p.id} className="admin-post-card">
                    <div className="admin-post-card-img">
                      {p.thumbnail && (
                        <Image src={p.thumbnail} alt={p.title} fill style={{ objectFit: "cover" }} unoptimized />
                      )}
                    </div>
                    <div className="admin-post-card-body">
                      <div className="admin-post-card-title">{p.title}</div>
                      <div className="admin-post-card-meta">
                        {p.designer && `Designer: ${p.designer}`}
                        {" · "}
                        <span className={`admin-badge admin-badge-xs ${p.published ? "admin-badge-green" : "admin-badge-gray"}`}>
                          {p.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <div className="admin-post-card-actions">
                        <Link href={`/admin/posts/${p.id}`} className="admin-btn admin-btn-outline admin-btn-sm">Edit</Link>
                        <DeletePostBtn id={p.id} title={p.title} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
