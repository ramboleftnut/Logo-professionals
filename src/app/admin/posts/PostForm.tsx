"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface TeamMember { id: string; name: string; slug: string; }
interface PostData {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  thumbnail?: string;
  gallery?: string[];
  type?: "blog" | "portfolio";
  designer?: string | null;
  tags?: string[];
  published?: boolean;
}

async function uploadFile(file: File, folder: string): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json();
  return data.path as string;
}

export default function PostForm({ initial, team }: { initial?: PostData; team: TeamMember[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    thumbnail: initial?.thumbnail ?? "",
    gallery: initial?.gallery ?? [] as string[],
    type: (initial?.type ?? "blog") as "blog" | "portfolio",
    designer: initial?.designer ?? null as string | null,
    tags: initial?.tags?.join(", ") ?? "",
    published: initial?.published ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const thumbRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function handleThumbUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const path = await uploadFile(file, "blog");
    set("thumbnail", path);
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const paths = await Promise.all(files.map((f) => uploadFile(f, "blog")));
    set("gallery", [...form.gallery, ...paths]);
  }

  function removeGalleryItem(idx: number) {
    set("gallery", form.gallery.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        designer: form.type === "portfolio" ? form.designer : null,
      };
      const url = initial?.id ? `/api/posts/${initial.id}` : "/api/posts";
      const method = initial?.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Save failed.");
        return;
      }
      router.push("/admin/posts");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

  return (
    <form onSubmit={handleSubmit} className="admin-form">

      {/* Type toggle */}
      <div className="admin-field">
        <label className="admin-label">Post Type</label>
        <div className="admin-toggle-group">
          <button type="button" className={`admin-toggle-option${form.type === "blog" ? " selected" : ""}`} onClick={() => set("type", "blog")}>
            Blog Post
          </button>
          <button type="button" className={`admin-toggle-option${form.type === "portfolio" ? " selected" : ""}`} onClick={() => set("type", "portfolio")}>
            Portfolio Item
          </button>
        </div>
        <span className="admin-hint">
          {form.type === "blog" ? "Appears on /blog" : "Appears in the portfolio grid and on the assigned designer's page"}
        </span>
      </div>

      {/* Designer assignment (only for portfolio) */}
      {form.type === "portfolio" && (
        <div className="admin-field">
          <label className="admin-label">Assign to Designer *</label>
          <select
            className="admin-select"
            required={form.type === "portfolio"}
            value={form.designer ?? ""}
            onChange={(e) => set("designer", e.target.value || null)}
          >
            <option value="">— Select designer —</option>
            {team.map((m) => (
              <option key={m.id} value={m.slug}>{m.name}</option>
            ))}
          </select>
          <span className="admin-hint">This item will appear on the selected designer's profile page.</span>
        </div>
      )}

      <div className="admin-field-row">
        <div className="admin-field">
          <label className="admin-label">Title *</label>
          <input
            className="admin-input" required
            value={form.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (!initial?.id) set("slug", autoSlug(e.target.value));
            }}
          />
        </div>
        <div className="admin-field">
          <label className="admin-label">URL Slug *</label>
          <input className="admin-input" required value={form.slug} onChange={(e) => set("slug", e.target.value)} />
          <span className="admin-hint">
            {form.type === "blog" ? `/blog/${form.slug || "..."}` : `/portfolio/${form.slug || "..."}`}
          </span>
        </div>
      </div>

      <div className="admin-field">
        <label className="admin-label">Excerpt / Short Description</label>
        <textarea className="admin-textarea" style={{ minHeight: 80 }} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="One or two sentences that appear on the card preview." />
      </div>

      <div className="admin-field">
        <label className="admin-label">Content (HTML)</label>
        <textarea className="admin-textarea" style={{ minHeight: 240 }} value={form.content} onChange={(e) => set("content", e.target.value)} placeholder="Full post content. You can write plain text or HTML." />
        <span className="admin-hint">Supports HTML: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;, &lt;img&gt;, etc.</span>
      </div>

      <div className="admin-field">
        <label className="admin-label">Tags (comma separated)</label>
        <input className="admin-input" value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="e.g. Logo Design, Branding, Typography" />
      </div>

      {/* Thumbnail */}
      <div className="admin-field">
        <label className="admin-label">Thumbnail / Cover Image</label>
        <div className="admin-upload-zone" onClick={() => thumbRef.current?.click()}>
          {form.thumbnail ? (
            <div style={{ position: "relative" }}>
              <Image src={form.thumbnail} alt="Thumbnail" width={400} height={200} style={{ objectFit: "cover", borderRadius: 8, width: "100%", height: "auto" }} unoptimized />
              <button
                type="button"
                style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)", border: "none", color: "#e05c5c", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}
                onClick={(e) => { e.stopPropagation(); set("thumbnail", ""); }}
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <div className="admin-upload-zone-icon">🖼</div>
              <div className="admin-upload-zone-text">Click to <span>upload cover image</span></div>
            </>
          )}
        </div>
        <input ref={thumbRef} type="file" accept="image/*,video/*" style={{ display: "none" }} onChange={handleThumbUpload} />
      </div>

      {/* Gallery */}
      <div className="admin-field">
        <label className="admin-label">Gallery (optional — multiple images/videos)</label>
        <div className="admin-upload-zone" onClick={() => galleryRef.current?.click()}>
          <div className="admin-upload-zone-icon">📂</div>
          <div className="admin-upload-zone-text">Click to <span>add gallery files</span> (images or video)</div>
        </div>
        <input ref={galleryRef} type="file" accept="image/*,video/*" multiple style={{ display: "none" }} onChange={handleGalleryUpload} />
        {form.gallery.length > 0 && (
          <div className="admin-thumb-list">
            {form.gallery.map((src, i) => (
              <div key={i} className="admin-thumb">
                {isVideo(src) ? (
                  <video src={src} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <Image src={src} alt="" fill style={{ objectFit: "cover" }} unoptimized />
                )}
                <button type="button" className="admin-thumb-remove" onClick={() => removeGalleryItem(i)}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Published toggle */}
      <div className="admin-field">
        <label className="admin-label">Visibility</label>
        <div className="admin-toggle-group">
          <button type="button" className={`admin-toggle-option${!form.published ? " selected" : ""}`} onClick={() => set("published", false)}>
            Draft
          </button>
          <button type="button" className={`admin-toggle-option${form.published ? " selected" : ""}`} onClick={() => set("published", true)}>
            Published
          </button>
        </div>
      </div>

      {error && <div className="admin-error-msg">{error}</div>}

      <div style={{ display: "flex", gap: 12 }}>
        <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
          {saving ? "Saving…" : initial?.id ? "Save Changes" : "Create Post"}
        </button>
        <button type="button" onClick={() => router.back()} className="admin-btn admin-btn-outline">Cancel</button>
      </div>
    </form>
  );
}
