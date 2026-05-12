"use client";

import { useState } from "react";
import "./BrandingOrderPage.css";

// ── Types ──────────────────────────────────────────────────────────────────
type Tier = "logo_only" | "logo_brand" | "full_brand" | "redesign";

interface FormState {
  // Step 1 — Service
  tier: Tier | "";
  // Step 2 — Brand Info
  clientName: string;
  clientEmail: string;
  companyName: string;
  industry: string;
  tagline: string;
  description: string;
  // Step 3 — Style
  styles: string[];
  // Step 4 — Colors
  colorPrefs: string;
  // Step 5 — Notes
  notes: string;
}

// ── Data ───────────────────────────────────────────────────────────────────
const TIERS = [
  {
    id: "logo_only" as Tier,
    label: "Logo Design",
    price: "$180",
    desc: "Custom logo concept + all revisions + vector source files (AI, EPS, PNG, PDF).",
  },
  {
    id: "logo_brand" as Tier,
    label: "Logo + Brand Identity",
    price: "$450",
    desc: "Logo design + color palette + typography system + brand guidelines PDF.",
  },
  {
    id: "full_brand" as Tier,
    label: "Full Branding Package",
    price: "$900",
    desc: "Complete identity: logo, guidelines, business card, letterhead, social media kit.",
  },
  {
    id: "redesign" as Tier,
    label: "Logo Redesign",
    price: "$150",
    desc: "Refresh and modernize your existing logo while keeping brand recognition.",
  },
];

const STYLE_OPTIONS = [
  "Minimalist", "Vintage / Retro", "Geometric", "Handcrafted / Organic",
  "Bold & Modern", "Elegant / Luxury", "Playful / Fun", "Tech / Corporate",
  "Illustrative", "Typographic",
];

const STEPS = ["Service", "Brand Info", "Style", "Colors", "Review"];

// ── Helper ─────────────────────────────────────────────────────────────────
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

// ── Main Component ─────────────────────────────────────────────────────────
export default function BrandingOrderPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    tier: "",
    clientName: "", clientEmail: "", companyName: "", industry: "", tagline: "", description: "",
    styles: [],
    colorPrefs: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleStyle(s: string) {
    set("styles", form.styles.includes(s)
      ? form.styles.filter((x) => x !== s)
      : [...form.styles, s]
    );
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
      const res = await fetch("/api/branding-checkout", {
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
      <div className="bo-container">
        <div className="bo-header">
          <p className="bo-eyebrow">Branding & Identity</p>
          <h1 className="bo-title">Start Your Branding Project</h1>
          <p className="bo-subtitle">Tell us about your brand and we&apos;ll create something iconic.</p>
        </div>

        <div className="bo-wizard-card">
          <WizardProgress step={step} />

          {/* Step 0 — Service Selection */}
          {step === 0 && (
            <div className="bo-step">
              <h2 className="bo-step-title">What do you need?</h2>
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

          {/* Step 1 — Brand Info */}
          {step === 1 && (
            <div className="bo-step">
              <h2 className="bo-step-title">Tell us about you & your brand</h2>
              <div className="bo-fields">
                <div className="bo-field-row">
                  <div className="bo-field">
                    <label className="bo-label">Your Name *</label>
                    <input className="bo-input" value={form.clientName} onChange={(e) => set("clientName", e.target.value)} placeholder="John Smith" />
                  </div>
                  <div className="bo-field">
                    <label className="bo-label">Email *</label>
                    <input className="bo-input" type="email" value={form.clientEmail} onChange={(e) => set("clientEmail", e.target.value)} placeholder="john@company.com" />
                  </div>
                </div>
                <div className="bo-field-row">
                  <div className="bo-field">
                    <label className="bo-label">Company / Brand Name *</label>
                    <input className="bo-input" value={form.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="Acme Co." />
                  </div>
                  <div className="bo-field">
                    <label className="bo-label">Industry</label>
                    <input className="bo-input" value={form.industry} onChange={(e) => set("industry", e.target.value)} placeholder="e.g. Fitness, Food & Beverage, Tech…" />
                  </div>
                </div>
                <div className="bo-field">
                  <label className="bo-label">Tagline (if you have one)</label>
                  <input className="bo-input" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="e.g. Just do it." />
                </div>
                <div className="bo-field">
                  <label className="bo-label">Describe your brand / business *</label>
                  <textarea className="bo-textarea" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What do you do? Who is your target audience? What makes you different from competitors?" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Style */}
          {step === 2 && (
            <div className="bo-step">
              <h2 className="bo-step-title">What style speaks to your brand?</h2>
              <p className="bo-step-sub">Select all that apply — you can choose multiple.</p>
              <div className="bo-style-grid">
                {STYLE_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`bo-style-option${form.styles.includes(s) ? " selected" : ""}`}
                    onClick={() => toggleStyle(s)}
                  >
                    {form.styles.includes(s) && <span className="bo-style-check">✓ </span>}
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Colors */}
          {step === 3 && (
            <div className="bo-step">
              <h2 className="bo-step-title">Color preferences</h2>
              <p className="bo-step-sub">Tell us about your preferred color direction. Our designers will create the palette.</p>
              <div className="bo-fields">
                <div className="bo-field">
                  <label className="bo-label">Color preferences</label>
                  <textarea
                    className="bo-textarea"
                    value={form.colorPrefs}
                    onChange={(e) => set("colorPrefs", e.target.value)}
                    placeholder="e.g. Dark navy and gold — elegant and professional. Or: earthy tones, greens and browns. No bright colors. Reference brands: Rolex, Hermès."
                  />
                </div>
                <div className="bo-field">
                  <label className="bo-label">Additional notes / anything else we should know</label>
                  <textarea
                    className="bo-textarea"
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    placeholder="Reference websites, competitor brands, specific requirements, file formats needed, deadline…"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Review */}
          {step === 4 && (
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
                  <div className="bo-review-row"><span>Brand</span><span>{form.companyName}</span></div>
                  {form.industry && <div className="bo-review-row"><span>Industry</span><span>{form.industry}</span></div>}
                  {form.styles.length > 0 && <div className="bo-review-row"><span>Style</span><span>{form.styles.join(", ")}</span></div>}
                  {form.colorPrefs && <div className="bo-review-row"><span>Colors</span><span>{form.colorPrefs.slice(0, 80)}{form.colorPrefs.length > 80 ? "…" : ""}</span></div>}
                </div>
                <p className="bo-review-note">
                  After payment you&apos;ll receive a confirmation email. We&apos;ll start working within 1 business day.
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
            {step < 4 && (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
                className="bo-nav-next"
              >
                {step === 3 ? "Review Order →" : "Next →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
