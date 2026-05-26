"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DeletePostBtn from "./DeletePostBtn";

interface PostRow {
  id: string;
  type: "blog" | "portfolio";
  title: string;
  slug: string;
  thumbnail: string;
  teamMember: string | null;
  published: boolean;
  createdAt: string;
  views: number;
}

type SortKey = "date" | "views" | "title";
type TypeFilter = "all" | "blog" | "portfolio";

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function applyFilters(rows: PostRow[], search: string, sort: SortKey, type: TypeFilter): PostRow[] {
  const needle = search.trim().toLowerCase();
  let filtered = type === "all" ? rows : rows.filter((r) => r.type === type);
  if (needle) filtered = filtered.filter((r) => r.title.toLowerCase().includes(needle));
  const copy = [...filtered];
  copy.sort((a, b) => {
    if (sort === "views") return b.views - a.views;
    if (sort === "title") return a.title.localeCompare(b.title);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  return copy;
}

export default function PostsList({ posts }: { posts: PostRow[] }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("date");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const items = useMemo(
    () => applyFilters(posts, search, sort, typeFilter),
    [posts, search, sort, typeFilter],
  );

  const sectionLabel =
    typeFilter === "blog" ? "Blog Posts" : typeFilter === "portfolio" ? "Portfolio Items" : "All Content";

  return (
    <>
      <div className="admin-list-toolbar">
        <input
          type="search"
          placeholder="Search by title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-list-search"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
          className="admin-list-sort"
        >
          <option value="all">Type: All</option>
          <option value="blog">Type: Blog</option>
          <option value="portfolio">Type: Portfolio</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="admin-list-sort"
        >
          <option value="date">Sort: Newest first</option>
          <option value="views">Sort: Most views</option>
          <option value="title">Sort: Title (A–Z)</option>
        </select>
      </div>

      {items.length > 0 ? (
        <>
          <h2 className="admin-table-section-label">{sectionLabel} ({items.length})</h2>
          <div className="admin-posts-grid">
            {items.map((p) => {
              const viewHref = p.type === "blog" ? `/blog/${p.slug}` : `/portfolio/${p.slug}`;
              return (
                <div key={p.id} className="admin-post-card">
                  <Link href={viewHref} target="_blank" className="admin-post-card-img">
                    {p.thumbnail && (
                      <Image src={p.thumbnail} alt={p.title} fill style={{ objectFit: "cover" }} unoptimized />
                    )}
                  </Link>
                  <div className="admin-post-card-body">
                    <div className="admin-post-card-title">{p.title}</div>
                    <div className="admin-post-card-meta">
                      <span className={`admin-badge admin-badge-xs ${p.type === "blog" ? "admin-badge-green" : "admin-badge-gray"}`}>
                        {p.type === "blog" ? "Blog" : "Portfolio"}
                      </span>
                      {" · "}
                      {p.type === "portfolio" && p.teamMember
                        ? `${p.teamMember}`
                        : formatDate(p.createdAt)}
                      {" · "}
                      <span className={`admin-badge admin-badge-xs ${p.published ? "admin-badge-green" : "admin-badge-gray"}`}>
                        {p.published ? "Published" : "Draft"}
                      </span>
                      {" · "}
                      <span className="admin-views-inline">{p.views.toLocaleString()} views</span>
                    </div>
                    <div className="admin-post-card-actions admin-row-actions--split">
                      <Link href={viewHref} target="_blank" className="admin-btn admin-btn-outline admin-btn-sm">View</Link>
                      <div className="admin-row-actions">
                        <Link href={`/admin/posts/${p.id}`} className="admin-btn admin-btn-outline admin-btn-sm">Edit</Link>
                        <DeletePostBtn id={p.id} title={p.title} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="admin-empty">
          <div className="admin-empty-text">
            {search ? `No posts match “${search}”.` : "No posts yet."}
          </div>
        </div>
      )}
    </>
  );
}
