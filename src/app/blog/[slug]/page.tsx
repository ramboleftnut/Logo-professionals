import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import "../blog.css";

async function getPost(slug: string) {
  const snap = await adminDb
    .collection("posts")
    .where("slug", "==", slug)
    .where("type", "==", "blog")
    .where("published", "==", true)
    .limit(1)
    .get();

  if (snap.empty) return null;
  const doc = snap.docs[0];
  const d = doc.data();
  return {
    id: doc.id,
    title: d.title as string,
    slug: d.slug as string,
    excerpt: (d.excerpt ?? "") as string,
    content: (d.content ?? "") as string,
    thumbnail: (d.thumbnail ?? "") as string,
    gallery: (d.gallery ?? []) as string[],
    tags: (d.tags ?? []) as string[],
    createdAt: d.createdAt?.toDate?.()?.toISOString() ?? null as string | null,
  };
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);
  if (!post) return {};
  return {
    title: `${post.title} — The Logo Professionals Blog`,
    description: post.excerpt || post.title,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);
  if (!post) notFound();

  const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

  return (
    <div className="blog-post-page">
      {post.thumbnail ? (
        <div className="blog-post-hero">
          <Image src={post.thumbnail} alt={post.title} fill style={{ objectFit: "cover" }} unoptimized priority />
          <div className="blog-post-hero-overlay" />
          <div className="blog-post-hero-content">
            <div className="blog-post-meta">
              {post.tags.slice(0, 3).map((t) => (
                <span key={t} className="blog-tag">{t}</span>
              ))}
              {post.createdAt && <span className="blog-date">{formatDate(post.createdAt)}</span>}
            </div>
            <h1 className="blog-post-title">{post.title}</h1>
          </div>
        </div>
      ) : (
        <div className="blog-post-hero-no-image">
          <div className="blog-post-hero-no-image-inner">
            <div className="blog-post-meta">
              {post.tags.slice(0, 3).map((t) => (
                <span key={t} className="blog-tag">{t}</span>
              ))}
            </div>
            <h1 className="blog-post-title">{post.title}</h1>
          </div>
        </div>
      )}

      <div className="blog-post-body">
        <div className="blog-post-inner">
          <Link href="/blog" className="blog-back-link">← Back to Blog</Link>

          {post.excerpt && <p className="blog-post-excerpt">{post.excerpt}</p>}

          {post.content && (
            <div
              className="blog-post-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {post.gallery.length > 0 && (
            <div className="blog-post-gallery">
              <h3>Gallery</h3>
              <div className="blog-post-gallery-grid">
                {post.gallery.map((src, i) => (
                  <div key={i} className="blog-post-gallery-item">
                    {isVideo(src) ? (
                      <video src={src} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <Image src={src} alt={`Gallery ${i + 1}`} fill style={{ objectFit: "cover" }} unoptimized />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
