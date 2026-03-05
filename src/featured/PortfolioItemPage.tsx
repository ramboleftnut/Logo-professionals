import Image from "next/image";
import Link from "next/link";
import { portfolioItems } from "@/lib/data";
import AutoplayVideo from "@/components/ui/AutoplayVideo";
import "./PortfolioItemPage.css";

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image: string;
  designer: string;
  slug: string;
  images: string[];
}

interface PortfolioItemPageProps {
  item: PortfolioItem;
}

const designerMeta: Record<string, { slug: string; image: string }> = {
  Alekxa: { slug: "alekxa-dola", image: "/team/alekxa-dola/personal-images/profile.jpg" },
  Igor:   { slug: "igor-dola",   image: "/team/igor-dola/personal-images/profile.png" },
  Niko:   { slug: "niko-dola",   image: "/team/niko-dola/personal-images/profile.jpg" },
};

export default function PortfolioItemPage({ item }: PortfolioItemPageProps) {
  const related = portfolioItems
    .filter((p) => p.slug !== item.slug && p.designer === item.designer)
    .slice(0, 3);

  const allImages = [item.image, ...item.images];
  const designer = designerMeta[item.designer];

  return (
    <>
      {/* Hero */}
      <section className="pitem-hero">
        <div className="pitem-hero-image">
          <Image
            src={item.image}
            alt={item.title}
            fill
            style={{ objectFit: "cover" }}
            priority
            unoptimized
          />
          <div className="pitem-hero-overlay" />
        </div>
        <div className="pitem-hero-content">
          <Link href="/our-clients" className="pitem-back">
            ← Back to Portfolio
          </Link>

          <p className="pitem-hero-eyebrow">Portfolio</p>
          <h1 className="pitem-hero-title">{item.title}</h1>
        </div>
      </section>

      {/* Project info */}
      <section className="pitem-info">
        <div className="pitem-info-inner">
          <p className="pitem-description">{item.description}</p>
          <Link href="/logo-design/order" className="pitem-cta">
            Order a Similar Design
          </Link>
        </div>
      </section>

      {/* Image / video gallery — thumbnail + numbered files */}
      <section className="pitem-gallery">
        <div className="pitem-gallery-inner">
          {allImages.map((src, idx) =>
            src.endsWith(".mp4") || src.endsWith(".mov") ? (
              <div key={idx} className="pitem-gallery-video-wrap">
                <AutoplayVideo src={src} className="pitem-gallery-video" />
              </div>
            ) : (
              <div key={idx} className="pitem-gallery-image">
                <Image
                  src={src}
                  alt={`${item.title} — view ${idx + 1}`}
                  fill
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              </div>
            )
          )}
        </div>
      </section>

      {/* Related work by same designer */}
      {related.length > 0 && (
        <section className="pitem-related">
          <div className="pitem-related-inner">
            <p className="pitem-related-eyebrow">More by {item.designer}</p>
            <div className="pitem-related-grid">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/portfolio/${r.slug}`}
                  className="pitem-related-item"
                >
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                  <div className="pitem-related-overlay">
                    <span>{r.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
          {designer && (
            <Link href={`/about-us/${designer.slug}`} className="pitem-designer-avatar-link">
              <div className="pitem-designer-avatar">
                <Image
                  src={designer.image}
                  alt={item.designer}
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
              <span className="pitem-designer-avatar-name">{item.designer}</span>
            </Link>
          )}
      {/* CTA strip */}
      <section className="pitem-footer-cta">
        <div className="pitem-footer-cta-inner">
          <h2>Ready to build your brand?</h2>
          <p>Tell us your vision and we&apos;ll bring it to life.</p>
          <Link href="/logo-design/order" className="pitem-footer-btn">
            Start Your Order
          </Link>
        </div>
        
      </section>
    </>
  );
}
