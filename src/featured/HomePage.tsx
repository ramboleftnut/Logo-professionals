import Image from "next/image";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import PortfolioGrid from "@/components/sections/PortfolioGrid";
import ClientLogos from "@/components/sections/ClientLogos";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Button from "@/components/ui/Button";
import "./HomePage.css";

export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow="Expert Logo Design Studio"
        title={
          <>
            Stand out from
            <br />
            the <em>crowd.</em>
          </>
        }
        subtitle="We craft exceptional, one-of-a-kind logo designs that represent who you are — built to make a lasting impression across every market."
        primaryCta={{ label: "Order Your Logo", href: "/logo-design" }}
        secondaryCta={{ label: "See Our Work", href: "/our-clients" }}
      />

      <Stats />

      <ClientLogos />

      {/* About mini section */}
      <section className="home-about">
        <div className="home-about-inner">
          <div>
            <p className="home-about-eyebrow">Who We Are</p>
            <h2 className="home-about-title">
              Your logo is more than
              <br />a pretty image.
            </h2>
            <p className="home-about-text">
              We are a team of professional logo designers who specialize in
              branding and logo design. We understand that your logo is a
              representation of your company&apos;s values, mission, and story.
            </p>
            <p className="home-about-text">
              That&apos;s why we take the time to get to know you and your
              business, so we can create a logo that truly represents who you
              are — not just another generic design.
            </p>

            <div className="home-about-features">
              <div className="home-about-feature">
                <div className="home-feature-icon">◈</div>
                <div className="home-feature-content">
                  <h4>Detail Oriented</h4>
                  <p>Attention to aesthetics, not just popular trends.</p>
                </div>
              </div>
              <div className="home-about-feature">
                <div className="home-feature-icon">◎</div>
                <div className="home-feature-content">
                  <h4>Research-Driven</h4>
                  <p>We study what you need and what your clients respond to.</p>
                </div>
              </div>
              <div className="home-about-feature">
                <div className="home-feature-icon">◇</div>
                <div className="home-feature-content">
                  <h4>Complete File Delivery</h4>
                  <p>
                    Vector EPS, high-res PNG, PDF — everything you need to use
                    your logo anywhere.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div className="home-about-image-wrap">
              <Image
                src="/images/home-web.jpg"
                alt="Logo Professionals workspace"
                fill
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </div>
            <div className="home-about-image-accent" />
          </div>
        </div>
      </section>

      {/* Portfolio - uses shared data (same source as /our-clients) */}
      <PortfolioGrid limit={6} />

      <Testimonials />

      <FAQ />

      {/* CTA banner */}
      <section className="home-cta-banner">
        <h2>Ready to elevate your brand?</h2>
        <p>
          You want your company or startup to look professional and stand out in
          a sea of competition. Let&apos;s make it happen.
        </p>
        <Button href="/logo-design" variant="primary" size="lg">
          Order Your Logo — $180
        </Button>
      </section>
    </>
  );
}
