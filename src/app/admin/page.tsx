import Link from "next/link";
import { adminDb } from "@/lib/firebase/admin";

async function getCounts() {
  const [ordersSnap, postsSnap, teamSnap] = await Promise.all([
    adminDb.collection("orders").count().get(),
    adminDb.collection("posts").count().get(),
    adminDb.collection("team").count().get(),
  ]);
  return {
    orders: ordersSnap.data().count,
    posts: postsSnap.data().count,
    team: teamSnap.data().count,
  };
}

export default async function AdminDashboard() {
  const counts = await getCounts().catch(() => ({ orders: 0, posts: 0, team: 0 }));

  return (
    <div className="admin-content">
      <div className="admin-section-header" style={{ marginBottom: 8 }}>
        <h1 className="admin-section-title">Dashboard</h1>
      </div>
      <p style={{ color: "#606060", fontSize: 13, marginBottom: 32 }}>
        Welcome to The Logo Professionals admin.
      </p>

      <div className="admin-dashboard-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{counts.orders}</div>
          <div className="admin-stat-label">Total Orders</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{counts.posts}</div>
          <div className="admin-stat-label">Blog / Portfolio Posts</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{counts.team}</div>
          <div className="admin-stat-label">Team Members</div>
        </div>
      </div>

      <div className="admin-section-header" style={{ marginBottom: 16 }}>
        <h2 className="admin-section-title" style={{ fontSize: 16 }}>Quick Actions</h2>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/admin/posts/new" className="admin-btn admin-btn-primary">+ New Post</Link>
        <Link href="/admin/team/new" className="admin-btn admin-btn-outline">+ Add Team Member</Link>
        <Link href="/admin/orders" className="admin-btn admin-btn-outline">View Orders</Link>
      </div>
    </div>
  );
}
