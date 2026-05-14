import { notFound } from "next/navigation";
import { getTeam, getPosts } from "@/lib/content";
import TeamMemberPage from "@/featured/TeamMemberPage";
import ViewTracker from "@/components/ui/ViewTracker";

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
  const [team, memberWork] = await Promise.all([
    getTeam(),
    getPosts({ type: "portfolio", teamMember: slug, publishedOnly: true }),
  ]);

  const member = team.find((m) => m.slug === slug);
  if (!member) notFound();

  const portfolio = memberWork.map((p) => ({ title: p.title, slug: p.slug, image: p.thumbnail }));
  const others = team.filter((m) => m.slug !== slug);

  return (
    <>
      <ViewTracker type="team" slug={member.slug} />
      <TeamMemberPage member={member} portfolio={portfolio} others={others} />
    </>
  );
}
