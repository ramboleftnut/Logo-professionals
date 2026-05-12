import Image from "next/image";
import Link from "next/link";
import { portfolioItems as staticItems } from "@/lib/data";
import { adminDb } from "@/lib/firebase/admin";
import "./PortfolioGrid.css";

interface DisplayItem {
  slug: string;
  title: string;
  image: string;
  designer: string;
}

async function getPortfolioItems(): Promise<DisplayItem[]> {
  const staticMapped: DisplayItem[] = staticItems.map((i) => ({
    slug: i.slug,
    title: i.title,
    image: i.image,
    designer: i.designer,
  }));

  try {
    const snap = await adminDb
      .collection("posts")
      .where("type", "==", "portfolio")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .get();

    const dynamicSlugs = new Set(staticMapped.map((i) => i.slug));
    const dynamic: DisplayItem[] = snap.docs
      .map((doc) => {
        const d = doc.data();
        return {
          slug: d.slug as string,
          title: d.title as string,
          image: d.thumbnail as string,
          designer: d.designer as string ?? "",
        };
      })
      .filter((i) => !dynamicSlugs.has(i.slug));

    return [...dynamic, ...staticMapped];
  } catch {
    return staticMapped;
  }
}

interface PortfolioGridProps {
  limit?: number;
  showHeader?: boolean;
}

export default async function PortfolioGrid({ limit, showHeader = true }: PortfolioGridProps) {
  const allItems = await getPortfolioItems();
  const items = limit ? allItems.slice(0, limit) : allItems;

  return (
    <section className="portfolio-section">
      {showHeader && (
        <div className="portfolio-header">
          <p className="portfolio-eyebrow">Our Work</p>
          <h2 className="portfolio-title">
            Logos crafted with purpose, built to last.
          </h2>
        </div>
      )}
      <div className="portfolio-grid">
        {items.map((item, idx) => (
          <Link
            key={item.slug}
            href={`/portfolio/${item.slug}`}
            className={`portfolio-item ${idx === 0 ? "featured" : ""}`}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 580px) 100vw, (max-width: 900px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              unoptimized
            />
            <div className="portfolio-item-overlay">
              <div className="portfolio-item-title">{item.title}</div>
              <div className="portfolio-item-designer">by {item.designer}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
