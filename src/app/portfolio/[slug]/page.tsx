import { portfolioItems } from "@/lib/data";
import PortfolioItemPage from "@/featured/PortfolioItemPage";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return portfolioItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = portfolioItems.find((i) => i.slug === slug);
  if (!item) return {};
  return {
    title: `${item.title} — The Logo Professionals`,
    description: item.description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = portfolioItems.find((i) => i.slug === slug);
  if (!item) notFound();
  return <PortfolioItemPage item={item} />;
}
