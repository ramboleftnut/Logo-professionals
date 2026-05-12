import "./admin.css";
import AdminSidebar from "./AdminSidebar";

export const metadata = { title: "Admin — The Logo Professionals" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
