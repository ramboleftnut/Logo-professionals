import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/content";
import ViewTracker from "@/components/ui/ViewTracker";
import BlogPostBody from "@/components/ui/BlogPostBody";
import BlogPostHero from "@/components/ui/BlogPostHero";
import "../blog.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://digitalnectar.space";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug, "blog");
  if (!post || !post.published) return {};

  const title = `${post.title} | Digital Nectar Blog`;
  const description = post.excerpt || post.title;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const images = post.thumbnail
    ? [{ url: post.thumbnail, width: 1200, height: 630, alt: post.title }]
    : [];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: "Digital Nectar",
      images,
      publishedTime: post.createdAt ?? undefined,
      modifiedTime: post.updatedAt ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug, "blog");
  if (!post || !post.published) notFound();

  const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

  return (
    <div className="blog-post-page">
      <ViewTracker type="blog" slug={post.slug} />
      {post.thumbnail ? (
        <BlogPostHero
          src={post.thumbnail}
          alt={post.title}
          title={post.title}
          tags={post.tags}
          date={post.createdAt ? formatDate(post.createdAt) : undefined}
        />
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

          <BlogPostBody html={post.content} blocks={post.blocks} />

          {post.gallery.length > 0 && (
            <div className="blog-post-gallery">
              <h3>Gallery</h3>
              <div className="blog-post-gallery-grid">
                {post.gallery.map((src, i) => (
                  <div key={i} className="blog-post-gallery-item">
                    {isVideo(src) ? (
                      <video src={src} muted playsInline className="blog-post-gallery-video" />
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
