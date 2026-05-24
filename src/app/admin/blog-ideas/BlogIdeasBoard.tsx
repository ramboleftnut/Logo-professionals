"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { BlogIdea } from "@/lib/content";

const SOCIAL_OPTIONS = ["Instagram", "Facebook", "LinkedIn", "TikTok", "X", "Pinterest", "YouTube"];

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", "blog-ideas");
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Upload failed.");
  return data.path as string;
}

export default function BlogIdeasBoard({ initialIdeas }: { initialIdeas: BlogIdea[] }) {
  const [ideas, setIdeas] = useState(initialIdeas);
  const [form, setForm] = useState({
    title: "",
    description: "",
    socialMedia: [] as string[],
    images: [] as string[],
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function toggleSocial(channel: string) {
    setForm((current) => ({
      ...current,
      socialMedia: current.socialMedia.includes(channel)
        ? current.socialMedia.filter((item) => item !== channel)
        : [...current.socialMedia, channel],
    }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setError("");
    try {
      const paths = await Promise.all(files.map(uploadFile));
      setForm((current) => ({ ...current, images: [...current.images, ...paths] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeDraftImage(src: string) {
    setForm((current) => ({ ...current, images: current.images.filter((image) => image !== src) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/blog-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Save failed.");
        return;
      }

      const nextIdea: BlogIdea = {
        id: data.id,
        title: form.title.trim(),
        description: form.description,
        socialMedia: form.socialMedia,
        images: form.images,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setIdeas((current) => [nextIdea, ...current]);
      setForm({ title: "", description: "", socialMedia: [], images: [] });
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const idea = ideas.find((item) => item.id === id);
    if (!idea || !confirm(`Delete "${idea.title}"?`)) return;

    const previous = ideas;
    setIdeas((current) => current.filter((item) => item.id !== id));
    const res = await fetch(`/api/blog-ideas/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setIdeas(previous);
      setError("Could not delete the idea.");
    }
  }

  return (
    <div className="admin-ideas-layout">
      <form onSubmit={handleSubmit} className="admin-card admin-form admin-idea-form">
        <div className="admin-field">
          <label className="admin-label">Title *</label>
          <input
            className="admin-input"
            required
            value={form.title}
            onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
            placeholder="Post idea title"
          />
        </div>

        <div className="admin-field">
          <label className="admin-label">Description</label>
          <textarea
            className="admin-textarea"
            value={form.description}
            onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
            placeholder="Notes, angle, talking points, draft caption..."
          />
        </div>

        <div className="admin-field">
          <label className="admin-label">Social Media</label>
          <div className="admin-toggle-group">
            {SOCIAL_OPTIONS.map((channel) => (
              <button
                key={channel}
                type="button"
                className={`admin-toggle-option${form.socialMedia.includes(channel) ? " selected" : ""}`}
                onClick={() => toggleSocial(channel)}
              >
                {channel}
              </button>
            ))}
          </div>
          <span className="admin-hint">Optional. Select where this idea could become a post.</span>
        </div>

        <div className="admin-field">
          <label className="admin-label">Images</label>
          <div className="admin-upload-zone admin-idea-upload" onClick={() => fileRef.current?.click()}>
            <div className="admin-upload-zone-icon">+</div>
            <div className="admin-upload-zone-text">
              {uploading ? "Uploading..." : <>Click to <span>add idea images</span></>}
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple className="admin-file-hidden" onChange={handleImageUpload} />

          {form.images.length > 0 && (
            <div className="admin-thumb-list">
              {form.images.map((src) => (
                <div key={src} className="admin-thumb">
                  <Image src={src} alt="" fill style={{ objectFit: "cover" }} unoptimized />
                  <button type="button" className="admin-thumb-remove" onClick={() => removeDraftImage(src)}>x</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <div className="admin-error-msg">{error}</div>}

        <div className="admin-actions-row">
          <button type="submit" disabled={saving || uploading} className="admin-btn admin-btn-primary">
            {saving ? "Saving..." : "Save Idea"}
          </button>
        </div>
      </form>

      <div className="admin-ideas-list">
        {ideas.length === 0 ? (
          <div className="admin-empty admin-card">
            <div className="admin-empty-text">No blog ideas yet.</div>
          </div>
        ) : (
          ideas.map((idea) => (
            <article key={idea.id} className="admin-card admin-idea-card">
              <div className="admin-idea-card-head">
                <div>
                  <h2 className="admin-idea-title">{idea.title}</h2>
                  <div className="admin-post-card-meta">{formatDate(idea.createdAt)}</div>
                </div>
                <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(idea.id)}>
                  Delete
                </button>
              </div>

              {idea.description && <p className="admin-idea-description">{idea.description}</p>}

              {idea.socialMedia.length > 0 && (
                <div className="admin-idea-socials">
                  {idea.socialMedia.map((channel) => (
                    <span key={channel} className="admin-badge admin-badge-gray">{channel}</span>
                  ))}
                </div>
              )}

              {idea.images.length > 0 && (
                <div className="admin-idea-images">
                  {idea.images.map((src) => (
                    <a key={src} href={src} target="_blank" className="admin-idea-image">
                      <Image src={src} alt="" fill style={{ objectFit: "cover" }} unoptimized />
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
