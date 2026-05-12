import Link from "next/link";
import { adminDb } from "@/lib/firebase/admin";

interface Order {
  id: string;
  type: string;
  status: string;
  clientName: string;
  clientEmail: string;
  companyName: string;
  tier?: string;
  amount: number;
  createdAt: FirebaseFirestore.Timestamp | null;
}

async function getOrders() {
  const snap = await adminDb.collection("orders").orderBy("createdAt", "desc").get();
  return snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Order, "id">) }));
}

function formatDate(ts: FirebaseFirestore.Timestamp | null) {
  if (!ts) return "—";
  return ts.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function statusBadge(status: string) {
  if (status === "paid") return "admin-badge-green";
  if (status === "pending") return "admin-badge-gold";
  if (status === "cancelled") return "admin-badge-red";
  return "admin-badge-gray";
}

function typeBadge(type: string) {
  if (type === "logo") return "admin-badge-blue";
  if (type === "branding") return "admin-badge-gold";
  if (type === "website") return "admin-badge-green";
  return "admin-badge-gray";
}

export default async function AdminOrdersPage() {
  const orders = await getOrders().catch(() => [] as Order[]);

  return (
    <div className="admin-content">
      <div className="admin-section-header">
        <h1 className="admin-section-title">Orders</h1>
        <div style={{ fontSize: 13, color: "#606060" }}>
          {orders.length} total · {orders.filter((o) => o.status === "paid").length} paid
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">📋</div>
          <div className="admin-empty-text">No orders yet.</div>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Company</th>
                <th>Type</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <div className="primary">{o.clientName || "—"}</div>
                    <div style={{ fontSize: 11, color: "#606060" }}>{o.clientEmail}</div>
                  </td>
                  <td>{o.companyName || "—"}</td>
                  <td>
                    <span className={`admin-badge ${typeBadge(o.type)}`}>{o.type}</span>
                    {o.tier && <span style={{ fontSize: 11, color: "#606060", marginLeft: 6 }}>{o.tier}</span>}
                  </td>
                  <td>
                    <span className={`admin-badge ${statusBadge(o.status)}`}>{o.status}</span>
                  </td>
                  <td>${((o.amount ?? 0) / 100).toFixed(2)}</td>
                  <td style={{ fontSize: 12, color: "#606060" }}>{formatDate(o.createdAt)}</td>
                  <td>
                    <Link href={`/admin/orders/${o.id}`} className="admin-btn admin-btn-outline admin-btn-sm">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
