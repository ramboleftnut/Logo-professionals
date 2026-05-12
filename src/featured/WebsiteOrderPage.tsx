"use client";

import { useState } from "react";
import "./BrandingOrderPage.css";
import "./WebsiteOrderPage.css";

type Tier = "landing" | "multi_page" | "ecommerce" | "custom";

interface FormState {
  tier: Tier | "";
  clientName: string;
  clientEmail: string;
  companyName: string;
  websiteType: string;
  description: string;
  pages: string[];
  style: string;
  features: string[];
  colorPrefs: string;
  notes: string;
}

const TIERS = [
  {
    id: "landing" as Tier,
    label: "Landing Page",
    price: "$500",
    desc: "Single-page website. Perfect for launches, promos, or freelancers.",
  },
  {
    id: "multi_page" as Tier,
    label: "Multi-Page Website",
    price: "$800",
    desc: "Up to 6 pages: Home, About, Services, Portfolio, Blog, Contact.",
  },
  {
    id: "ecommerce" as Tier,
    label: "E-Commerce Store",
    price: "$1,200",
    desc: "Online store with product listings, cart, and Stripe checkout.",
  },
  {
    id: "custom" as Tier,
    label: "Custom / Enterprise",
    price: "From $1,500",
    desc: "Complex requirements — let's talk. We'll provide a custom quote.",
  },
];

const PAGE_OPTIONS = [
  "Home", "About Us", "Services", "Portfolio / Gallery",
  "Blog", "Contact", "Pricing", "FAQ", "Team",
  "Landing Page", "Shop / Store", "Booking",
];

const STYLE_OPTIONS = [
  "Modern & Minimal", "Bold & Expressive", "Elegant / Luxury",
  "Playful & Creative", "Corporate / Professional", "Dark Mode",
  "Light & Airy", "Magazine / Editorial",
];

const FEATURE_OPTIONS = [
  "Contact Form", "Image Gallery", "Video Background",
  "Testimonials Section", "Blog / News", "E-Commerce / Shop",
  "Online Booking", "Newsletter Sign-up", "Live Chat",
  "Multi-language", "SEO Optimization", "Cookie Consent",
];

const STEPS = ["Package", "Site Info", "Pages", "Style", "Features", "Review"];

function WizardProgress({ step }: { step: number }) {
  return (
    <div className="bo-wizard-progress">
      {STEPS.map((label, i) => (
        <div key={i} className="bo-wizard-step-indicator">
          <div className={`bo-wizard-dot${i < step ? " done" : i === step ? " active" : ""}`}>
            {i < step ? "✓" : i + 1}
          </div>
          <div className={`bo-wizard-step-label${i === step ? " active" : ""}`}>{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function WebsiteOrderPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    tier: "",
    clientName: "", clientEmail: "", companyName: "", websiteType: "",
    description: "", pages: [], style: "",
    features: [], colorPrefs: "", notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function togglePage(p: string) {
    set("pages", form.pages.includes(p) ? form.pages.filter((x) => x !== p) : [...form.pages, p]);
  }
  function toggleFeature(f: string) {
    set("features", form.features.includes(f) ? form.features.filter((x) => x !== f) : [...form.features, f]);
  }

  function canNext() {
    if (step === 0) return !!form.tier;
    if (step === 1) return !!(form.clientName && form.clientEmail && form.companyName && form.description);
    return true;
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/website-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const selectedTier = TIERS.find((t) => t.id === form.tier);

  return (
    <div className="bo-page">
      <div className="bo-container" style={{ maxWidth: 900 }}>
        <div className="bo-header">
          <p className="bo-eyebrow">Website Design</p>
          <h1 className="bo-title">Order Your Website</h1>
          <p className="bo-subtitle">Professional websites designed and developed for your brand.</p>
        </div>

        <div className="bo-wizard-card">
          <WizardProgress step={step} />

          {/* Step 0 — Package */}
          {step === 0 && (
            <div className="bo-step">
              <h2 className="bo-step-title">Choose your package</h2>
              <div className="bo-tier-grid">
                {TIERS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`bo-tier-card${form.tier === t.id ? " selected" : ""}`}
                    onClick={() => set("tier", t.id)}
                  >
                    <div className="bo-tier-price">{t.price}</div>
                    <div className="bo-tier-label">{t.label}</div>
                    <p className="bo-tier-desc">{t.desc}</p>
                    {form.tier === t.id && <div className="bo-tier-check">✓</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1 — Site Info */}
          {step === 1 && (
            <div className="bo-step">
              <h2 className="bo-step-title">About you & your website</h2>
              <div className="bo-fields">
                <div className="bo-field-row">
                  <div className="bo-field">
                    <label className="bo-label">Your Name *</label>
                    <input className="bo-input" value={form.clientName} onChange={(e) => set("clientName", e.target.value)} />
                  </div>
                  <div className="bo-field">
                    <label className="bo-label">Email *</label>
                    <input className="bo-input" type="email" value={form.clientEmail} onChange={(e) => set("clientEmail", e.target.value)} />
                  </div>
                </div>
                <div className="bo-field-row">
                  <div className="bo-field">
                    <label className="bo-label">Business / Brand Name *</label>
                    <input className="bo-input" value={form.companyName} onChange={(e) => set("companyName", e.target.value)} />
                  </div>
                  <div className="bo-field">
                    <label className="bo-label">Website Type / Purpose</label>
                    <input className="bo-input" value={form.websiteType} onChange={(e) => set("websiteType", e.target.value)} placeholder="e.g. Portfolio, Restaurant, SaaS, Non-profit…" />
                  </div>
                </div>
                <div className="bo-field">
                  <label className="bo-label">Describe your business & website goals *</label>
                  <textarea className="bo-textarea" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What does your business do? Who is the target audience? What should the website achieve (bookings, sales, awareness)?" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Pages */}
          {step === 2 && (
            <div className="bo-step">
              <h2 className="bo-step-title">Which pages do you need?</h2>
              <p className="bo-step-sub">Select all that apply.</p>
              <div className="bo-style-grid">
                {PAGE_OPTIONS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`bo-style-option${form.pages.includes(p) ? " selected" : ""}`}
                    onClick={() => togglePage(p)}
                  >
                    {form.pages.includes(p) && <span className="bo-style-check">✓ </span>}
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Style */}
          {step === 3 && (
            <div className="bo-step">
              <h2 className="bo-step-title">Visual style direction</h2>
              <p className="bo-step-sub">Pick the aesthetic that fits your brand.</p>
              <div className="bo-style-grid">
                {STYLE_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`bo-style-option${form.style === s ? " selected" : ""}`}
                    onClick={() => set("style", form.style === s ? "" : s)}
                  >
                    {form.style === s && <span className="bo-style-check">✓ </span>}
                    {s}
                  </button>
                ))}
              </div>
              <div className="bo-field" style={{ marginTop: 24 }}>
                <label className="bo-label">Color preferences</label>
                <textarea className="bo-textarea" value={form.colorPrefs} onChange={(e) => set("colorPrefs", e.target.value)} placeholder="Describe your color direction or reference websites you like. e.g. Dark navy + gold, or: earthy greens and browns." style={{ minHeight: 80 }} />
              </div>
            </div>
          )}

          {/* Step 4 — Features */}
          {step === 4 && (
            <div className="bo-step">
              <h2 className="bo-step-title">What features do you need?</h2>
              <p className="bo-step-sub">Select all that apply.</p>
              <div className="bo-style-grid">
                {FEATURE_OPTIONS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`bo-style-option${form.features.includes(f) ? " selected" : ""}`}
                    onClick={() => toggleFeature(f)}
                  >
                    {form.features.includes(f) && <span className="bo-style-check">✓ </span>}
                    {f}
                  </button>
                ))}
              </div>
              <div className="bo-field" style={{ marginTop: 24 }}>
                <label className="bo-label">Additional notes</label>
                <textarea className="bo-textarea" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Reference websites, specific requirements, deadline, domain name, existing content…" style={{ minHeight: 80 }} />
              </div>
            </div>
          )}

          {/* Step 5 — Review */}
          {step === 5 && (
            <div className="bo-step">
              <h2 className="bo-step-title">Review your order</h2>
              <div className="bo-review-card">
                <div className="bo-review-tier">
                  <span className="bo-review-tier-label">{selectedTier?.label}</span>
                  <span className="bo-review-tier-price">{selectedTier?.price}</span>
                </div>
                <div className="bo-review-divider" />
                <div className="bo-review-rows">
                  <div className="bo-review-row"><span>Client</span><span>{form.clientName}</span></div>
                  <div className="bo-review-row"><span>Email</span><span>{form.clientEmail}</span></div>
                  <div className="bo-review-row"><span>Business</span><span>{form.companyName}</span></div>
                  {form.websiteType && <div className="bo-review-row"><span>Type</span><span>{form.websiteType}</span></div>}
                  {form.pages.length > 0 && <div className="bo-review-row"><span>Pages</span><span>{form.pages.join(", ")}</span></div>}
                  {form.style && <div className="bo-review-row"><span>Style</span><span>{form.style}</span></div>}
                  {form.features.length > 0 && <div className="bo-review-row"><span>Features</span><span>{form.features.join(", ")}</span></div>}
                </div>
                <p className="bo-review-note">
                  Payment secures your project slot. We&apos;ll reach out within 1 business day to schedule a discovery call.
                </p>
              </div>

              {error && <div className="bo-error">{error}</div>}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bo-pay-btn"
              >
                {loading ? "Redirecting to Stripe…" : `Pay ${selectedTier?.price} — Secure Checkout →`}
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="bo-nav">
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="bo-nav-back">
                ← Back
              </button>
            )}
            {step < 5 && (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
                className="bo-nav-next"
              >
                {step === 4 ? "Review Order →" : "Next →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
