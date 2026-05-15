import { notFound } from "next/navigation";
import PortfolioItemPage from "@/featured/PortfolioItemPage";
import ViewTracker from "@/components/ui/ViewTracker";
import { getPost, getPosts, getTeam } from "@/lib/content";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug, "portfolio");
  if (!post || !post.published) return {};
  return { title: `${post.title} — The Logo Professionals`, description: post.excerpt };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug, "portfolio");
  if (!post || !post.published) notFound();

  const [team, allPortfolio] = await Promise.all([
    getTeam(),
    getPosts({ type: "portfolio", publishedOnly: true }),
  ]);

  const member = team.find((m) => m.slug === post.teamMember) ?? null;

  const related = allPortfolio
    .filter((p) => p.slug !== post.slug && p.teamMember && p.teamMember === post.teamMember)
    .slice(0, 3)
    .map((p) => ({ title: p.title, slug: p.slug, image: p.thumbnail }));

  return (
    <>
      <ViewTracker type="portfolio" slug={post.slug} />
      <PortfolioItemPage
        item={{
          title: post.title,
          slug: post.slug,
          description: post.excerpt,
          image: post.thumbnail,
          images: post.gallery,
          blocks: post.blocks,
        }}
        teamMember={member ? { name: member.name, slug: member.slug, image: member.image } : null}
        related={related}
      />
    </>
  );
}
