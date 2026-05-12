import { notFound } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import { teamMembers as staticTeam } from "@/lib/data";
import TeamMemberPage, { type TeamMemberData } from "@/featured/TeamMemberPage";

async function getTeam(): Promise<TeamMemberData[]> {
  try {
    const snap = await adminDb.collection("team").orderBy("order", "asc").get();
    if (!snap.empty) {
      return snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<TeamMemberData, "id">) }));
    }
  } catch {}
  return staticTeam.map((m) => ({ ...m, portfolio: m.portfolio ?? [] }));
}

async function getDesignerPortfolio(designerSlug: string): Promise<{ title: string; slug: string; image: string }[]> {
  try {
    const snap = await adminDb
      .collection("posts")
      .where("type", "==", "portfolio")
      .where("designer", "==", designerSlug)
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .get();

    return snap.docs.map((doc) => {
      const d = doc.data();
      return { title: d.title as string, slug: d.slug as string, image: (d.thumbnail ?? "") as string };
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const team = await getTeam();
  const member = team.find((m) => m.slug === slug);
  if (!member) return {};
  return {
    title: `${member.name} — ${member.role} | The Logo Professionals`,
    description: member.bio?.slice(0, 160),
  };
}

export default async function TeamMemberRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [team, dynamicPortfolio] = await Promise.all([
    getTeam(),
    getDesignerPortfolio(slug),
  ]);

  const member = team.find((m) => m.slug === slug);
  if (!member) notFound();

  // Merge: dynamic Firestore portfolio items first, then static (avoiding slug duplicates)
  const staticPortfolio = member.portfolio ?? [];
  const dynamicSlugs = new Set(dynamicPortfolio.map((p) => p.slug));
  const mergedPortfolio = [
    ...dynamicPortfolio,
    ...staticPortfolio.filter((p) => !dynamicSlugs.has(p.slug)),
  ];

  const others = team.filter((m) => m.slug !== slug);

  return <TeamMemberPage member={{ ...member, portfolio: mergedPortfolio }} others={others} />;
}
