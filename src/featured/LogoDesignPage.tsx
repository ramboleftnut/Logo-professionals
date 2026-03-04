import Button from "@/components/ui/Button";
import { processSteps } from "@/lib/data";
import "./LogoDesignPage.css";

const terms = [
  {
    icon: "🔒",
    title: "Privacy",
    text: "Any information provided to us is kept strictly confidential. We will never share your final design on social media or with any third party without your explicit permission.",
  },
  {
    icon: "↩",
    title: "Refund Policy",
    text: "If you pay the full amount upfront and are not satisfied, there is a 70% refund available. The 33% deposit is non-refundable — but you can try again with a different direction at no extra cost.",
  },
  {
    icon: "📁",
    title: "Delivered Files",
    text: "The full package includes high-resolution JPG, PDF, PNG (transparent background), and vector source files (AI/EPS). Additional file formats are available upon request for an extra fee.",
  },
];

const stepIcons = ["✏", "◎", "↺", "✓"];

export default function LogoDesignPage() {
  return (
    <div className="logo-design-page">
      {/* Hero */}
      <div className="logo-design-hero">
        <div className="logo-design-price">
          <span className="logo-design-price-label">Full Logo Package</span>
          <span className="logo-design-price-amount">$180</span>
          <span className="logo-design-price-sub">
            or start with 33% deposit
          </span>
        </div>
        <h1 className="logo-design-hero-title">
          Custom Logo Design Order
        </h1>
        <p className="logo-design-hero-sub">
          Professional, unique, and delivered in 3–4 business days. Includes
          vector source files and all the formats you need.
        </p>
        <Button href="/logo-design/order" variant="primary" size="lg">
          Order Here →
        </Button>
      </div>

      {/* Process */}
      <div className="logo-process">
        <div className="logo-process-header">
          <p className="logo-process-eyebrow">How It Works</p>
          <h2 className="logo-process-title">Logo Design Process</h2>
        </div>
        <div className="logo-process-grid">
          {processSteps.map((step, idx) => (
            <div key={step.step} className="logo-process-step">
              <div className="logo-process-step-number">Step {step.step}</div>
              <div className="logo-process-step-icon">{stepIcons[idx]}</div>
              <h3 className="logo-process-step-title">{step.title}</h3>
              <p className="logo-process-step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div className="logo-terms">
        <div className="logo-terms-inner">
          <div className="logo-terms-header">
            <p className="logo-terms-eyebrow">Terms & Agreement</p>
            <h2 className="logo-terms-title">What to Expect</h2>
          </div>
          <div className="logo-terms-grid">
            {terms.map((t) => (
              <div key={t.title} className="logo-term-card">
                <div className="logo-term-card-icon">{t.icon}</div>
                <h3 className="logo-term-card-title">{t.title}</h3>
                <p className="logo-term-card-text">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="logo-cta">
        <h2>Ready to get started?</h2>
        <p>
          Place your order and we&apos;ll begin working on your logo within
          1 business day.
        </p>
        <Button href="/logo-design/order" variant="primary" size="lg">
          Order Your Logo — $180
        </Button>
      </div>
    </div>
  );
}
