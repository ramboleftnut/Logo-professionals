import PortfolioGrid from "@/components/sections/PortfolioGrid";
import FAQ from "@/components/sections/FAQ";
import Testimonials from "@/components/sections/Testimonials";
import ClientLogos from "@/components/sections/ClientLogos";
import Button from "@/components/ui/Button";
import "./OurClientsPage.css";

export default function OurClientsPage() {
  return (
    <>
      <div className="clients-hero">
        <p className="clients-hero-eyebrow">PORTFOLIO & CLIENTS</p>
        <h1 className="clients-hero-title">
          Work We&apos;re
          <br />
          Proud Of
        </h1>
        <p className="clients-hero-subtitle">
          Every project above was shared with client permission. From startups to
          established brands — this is what we do.
        </p>
        <div className="clients-pricing-note">
          <span className="clients-pricing-note-amount">$180</span>
          <span className="clients-pricing-note-text">
            Full logo package
            <br />
            Or start with 33% deposit
          </span>
        </div>
      </div>

      <PortfolioGrid showHeader={false} />

      <ClientLogos />

      <Testimonials />

      <FAQ />

      <section
        style={{
          background: "var(--surface)",
          padding: "80px 40px",
          textAlign: "center",
          borderTop: "1px solid var(--border)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(26px, 3vw, 38px)",
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: "16px",
          }}
        >
          Ready to join our portfolio?
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "var(--text-secondary)",
            marginBottom: "32px",
            maxWidth: "440px",
            margin: "0 auto 32px",
            lineHeight: "1.75",
          }}
        >
          Order your custom logo design today and see why clients from 36
          countries trust us with their brand.
        </p>
        <Button href="/logo-design" variant="primary" size="lg">
          Order Now
        </Button>
      </section>
    </>
  );
}
