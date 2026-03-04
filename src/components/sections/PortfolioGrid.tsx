import Image from "next/image";
import { portfolioItems } from "@/lib/data";
import "./PortfolioGrid.css";

interface PortfolioGridProps {
  limit?: number;
  showHeader?: boolean;
}

export default function PortfolioGrid({
  limit,
  showHeader = true,
}: PortfolioGridProps) {
  const items = limit ? portfolioItems.slice(0, limit) : portfolioItems;

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
          <div
            key={item.id}
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
          </div>
        ))}
      </div>
    </section>
  );
}
