import { getBlogIdeas } from "@/lib/content";
import BlogIdeasBoard from "./BlogIdeasBoard";

export default async function AdminBlogIdeasPage() {
  const ideas = await getBlogIdeas();

  return (
    <div className="admin-content">
      <div className="admin-section-header admin-section-header--tight">
        <h1 className="admin-section-title">Blog Ideas</h1>
      </div>
      <p className="admin-section-sub">Private notes for preparing future posts.</p>

      <BlogIdeasBoard initialIdeas={ideas} />
    </div>
  );
}
