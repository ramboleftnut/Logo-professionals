import Button from "@/components/ui/Button";
import "./Hero.css";

interface HeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  videoSrc?: string;
}

export default function Hero({
  eyebrow = "Expert Logo Design Studio",
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  videoSrc = "/Final_6_2.mp4",
}: HeroProps) {
  return (
    <section className="hero">
      {videoSrc ? (
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.jpg"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <div className="hero-bg-fallback" />
      )}
      <div className="hero-overlay" />

      <div className="hero-content">
        {eyebrow && (
          <p className="hero-eyebrow">
            {eyebrow}
          </p>
        )}

        <h1 className="hero-title">{title}</h1>

        {subtitle && <p className="hero-subtitle">{subtitle}</p>}

        {(primaryCta || secondaryCta) && (
          <div className="hero-actions">
            {primaryCta && (
              <Button href={primaryCta.href} variant="primary" size="lg">
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button href={secondaryCta.href} variant="outline" size="lg">
                {secondaryCta.label}
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="hero-scroll">
        <div className="hero-scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
