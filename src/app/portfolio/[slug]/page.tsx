import { portfolioItems } from "@/lib/data";
import PortfolioItemPage from "@/featured/PortfolioItemPage";
import { adminDb } from "@/lib/firebase/admin";
import { notFound } from "next/navigation";

async function getDynamicPost(slug: string) {
  const snap = await adminDb
    .collection("posts")
    .where("slug", "==", slug)
    .where("type", "==", "portfolio")
    .where("published", "==", true)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const d = snap.docs[0].data();
  return {
    id: 0,
    title: d.title as string,
    description: (d.excerpt ?? "") as string,
    image: (d.thumbnail ?? "") as string,
    designer: (d.designer ?? "") as string,
    slug: d.slug as string,
    images: (d.gallery ?? []) as string[],
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const staticItem = portfolioItems.find((i) => i.slug === slug);
  if (staticItem) return { title: `${staticItem.title} — The Logo Professionals`, description: staticItem.description };
  const dynamic = await getDynamicPost(slug).catch(() => null);
  if (dynamic) return { title: `${dynamic.title} — The Logo Professionals`, description: dynamic.description };
  return {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const staticItem = portfolioItems.find((i) => i.slug === slug);
  if (staticItem) return <PortfolioItemPage item={staticItem} />;

  const dynamic = await getDynamicPost(slug).catch(() => null);
  if (dynamic) return <PortfolioItemPage item={dynamic} />;

  notFound();
}
