import Link from "next/link";
import Image from "next/image";
import { getTeam } from "@/lib/content";
import DeleteTeamMemberBtn from "./DeleteTeamMemberBtn";

export default async function AdminTeamPage() {
  const members = await getTeam();

  return (
    <div className="admin-content">
      <div className="admin-section-header">
        <h1 className="admin-section-title">Team Members</h1>
        <Link href="/admin/team/new" className="admin-btn admin-btn-primary">+ Add Member</Link>
      </div>

      {members.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">👥</div>
          <div className="admin-empty-text">No team members yet. Add your first one.</div>
        </div>
      ) : (
        <div className="admin-team-grid">
          {members.map((m) => (
            <div key={m.id} className="admin-team-card">
              <div className="admin-team-card-img">
                {m.image && (
                  <Image src={m.image} alt={m.name} fill style={{ objectFit: "cover" }} unoptimized />
                )}
              </div>
              <div className="admin-team-card-body">
                <div className="admin-team-card-name">{m.name}</div>
                <div className="admin-team-card-role">{m.role}</div>
                <div className="admin-team-card-actions">
                  <Link href={`/admin/team/${m.id}`} className="admin-btn admin-btn-outline admin-btn-sm">Edit</Link>
                  <DeleteTeamMemberBtn id={m.id} name={m.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
