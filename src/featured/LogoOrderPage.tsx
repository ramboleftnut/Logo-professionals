"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import "./LogoOrderPage.css";

const TIERS = [
  {
    id: "deposit",
    name: "33% Deposit",
    price: "$60",
    priceNote: "of $180 total",
    desc: "Get your first concept + one revision. Pay the rest when you approve.",
    recommended: false,
    includes: [
      "1 logo concept",
      "1 free revision",
      "Medium-resolution JPG preview",
      "Remaining $120 due on final approval",
    ],
  },
  {
    id: "full",
    name: "Full Payment",
    price: "$180",
    priceNote: "complete package",
    desc: "Best value. Includes all revisions and complete vector source file delivery.",
    recommended: true,
    includes: [
      "1 logo concept + revisions",
      "High-res JPG, PNG (transparent)",
      "PDF + Vector Source Files (AI/EPS)",
      "70% refund available if not satisfied",
    ],
  },
  {
    id: "remaining",
    name: "Remaining Balance",
    price: "$120",
    priceNote: "final payment",
    desc: "Already paid the 33% deposit? Complete your payment to receive final files.",
    recommended: false,
    includes: [
      "Vector source files (AI/EPS)",
      "High-res PNG (transparent)",
      "PDF export",
      "Full delivery package",
    ],
  },
];

const STYLE_OPTIONS = [
  "Modern & Minimal",
  "Bold & Geometric",
  "Vintage & Rustic",
  "Elegant & Luxury",
  "Playful & Fun",
  "Corporate & Professional",
];

export default function LogoOrderPage() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState("full");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    companyName: "",
    industry: "",
    description: "",
    incorporate: "",
    logoName: "",
    avoid: "",
    colorPrefs: "",
    stylePrefs: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError("Please agree to the Terms and Agreement before proceeding.");
      return;
    }
    if (!form.name || !form.email || !form.description) {
      setError("Please fill in your name, email, and project description.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: selectedTier, ...form }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start checkout. Please try again."
      );
      setSubmitting(false);
    }
  };

  const activeTier = TIERS.find((t) => t.id === selectedTier)!;

  return (
    <div className="order-page">
      <div className="order-header">
        <p className="order-header-eyebrow">Custom Logo Design</p>
        <h1 className="order-header-title">Place Your Order</h1>
        <p className="order-header-sub">
          Fill in your design brief, choose a payment option, and we&apos;ll
          have your first concept ready in 1–2 business days.
        </p>
      </div>

      <form className="order-main" onSubmit={handleSubmit}>
        {/* ─── LEFT: FORM ─── */}
        <div className="order-form-col">

          {/* Step 1: Payment tier */}
          <div className="order-step-label">
            <div className="order-step-badge">1</div>
            <span className="order-step-badge-text">Choose Payment Option</span>
          </div>
          <h2 className="order-section-title">Select Your Package</h2>
          <p className="order-section-sub">
            You can start with a 33% deposit or pay the full amount upfront for
            the best value.
          </p>

          <div className="tier-grid">
            {TIERS.map((tier) => (
              <label key={tier.id} className="tier-option">
                <input
                  type="radio"
                  name="tier"
                  value={tier.id}
                  checked={selectedTier === tier.id}
                  onChange={() => setSelectedTier(tier.id)}
                />
                <div className="tier-card">
                  <div>
                    <div className="tier-name">{tier.name}</div>
                    <div className="tier-desc">{tier.desc}</div>
                  </div>
                  <div className="tier-badge">
                    {tier.recommended && (
                      <span className="tier-recommended">Best Value</span>
                    )}
                    <span className="tier-price">{tier.price}</span>
                    <span className="tier-price-note">{tier.priceNote}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <hr className="order-divider" />

          {/* Step 2: Contact info */}
          <div className="order-step-label">
            <div className="order-step-badge">2</div>
            <span className="order-step-badge-text">Your Information</span>
          </div>
          <h2 className="order-section-title">Contact Details</h2>
          <p className="order-section-sub">
            We&apos;ll use this to send your designs and stay in touch
            throughout the project.
          </p>

          <div className="order-form">
            <div className="order-form-row">
              <Input
                label="Full Name *"
                name="name"
                placeholder="John Smith"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Email Address *"
                name="email"
                type="email"
                placeholder="john@yourcompany.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="order-form-row">
              <Input
                label="Company / Project Name"
                name="companyName"
                placeholder="Acme Inc."
                value={form.companyName}
                onChange={handleChange}
              />
              <Input
                label="Industry / Business Type"
                name="industry"
                placeholder="e.g. Coffee Shop, Tech Startup"
                value={form.industry}
                onChange={handleChange}
              />
            </div>
          </div>

          <hr className="order-divider" />

          {/* Step 3: Design brief */}
          <div className="order-step-label">
            <div className="order-step-badge">3</div>
            <span className="order-step-badge-text">Design Brief</span>
          </div>
          <h2 className="order-section-title">Tell Us About Your Brand</h2>
          <p className="order-section-sub">
            The more specific you are, the better the result. A clear brief
            equals a great logo.
          </p>

          <div className="order-form">
            <Textarea
              label="Describe your business and what the logo should represent *"
              name="description"
              placeholder="We are a specialty coffee shop that focuses on sustainable, organic sourcing. We want our logo to feel warm, artisan, and approachable..."
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
            />

            <Textarea
              label="What would you like incorporated? (symbols, icons, elements)"
              name="incorporate"
              placeholder="e.g. A coffee cup, mountain silhouette, or leaf element that connects to nature..."
              value={form.incorporate}
              onChange={handleChange}
              rows={3}
            />

            <Input
              label="Business name / text to include in the logo"
              name="logoName"
              placeholder="The exact name or slogan to appear in the logo"
              value={form.logoName}
              onChange={handleChange}
            />

            <Textarea
              label="What should we avoid? (styles, elements, colors)"
              name="avoid"
              placeholder="e.g. Avoid clip-art style, no red colors, nothing too corporate or rigid..."
              value={form.avoid}
              onChange={handleChange}
              rows={3}
            />

            <div className="order-form-row">
              <Input
                label="Color preferences (optional)"
                name="colorPrefs"
                placeholder="e.g. Earthy tones, navy and gold, black and white..."
                value={form.colorPrefs}
                onChange={handleChange}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-secondary)",
                  }}
                >
                  Style Preference (optional)
                </label>
                <select
                  name="stylePrefs"
                  value={form.stylePrefs}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      stylePrefs: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    color: form.stylePrefs ? "var(--text)" : "var(--text-muted)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "14px",
                    padding: "14px 18px",
                    outline: "none",
                    appearance: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Select a style...</option>
                  {STYLE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                lineHeight: "1.6",
              }}
            >
              📎 Have a sketch or reference image? Email it to{" "}
              <a
                href="mailto:igor.dolovski@gmail.com"
                style={{ color: "var(--gold)" }}
              >
                igor.dolovski@gmail.com
              </a>{" "}
              after completing your order.
            </p>
          </div>

          <hr className="order-divider" />

          {/* Step 4: Terms */}
          <div className="order-step-label">
            <div className="order-step-badge">4</div>
            <span className="order-step-badge-text">Terms & Agreement</span>
          </div>

          <label className="terms-check">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <span className="terms-check-text">
              I agree to the Terms and Agreement. I understand that the 33%
              deposit is non-refundable, and that full payments are eligible for
              a 70% refund if unsatisfied. My design brief will be kept
              confidential and the final design will not be shared without my
              permission.
            </span>
          </label>

          {error && <p className="order-error">{error}</p>}

          <div className="order-submit-area">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
            >
              {submitting
                ? "Redirecting to Checkout..."
                : `Proceed to Payment — ${activeTier.price}`}
            </Button>
            <p className="order-submit-note">
              🔒 Secure payment powered by Stripe. You&apos;ll be redirected to
              complete payment.
            </p>
          </div>
        </div>

        {/* ─── RIGHT: SIDEBAR ─── */}
        <div className="order-sidebar">
          <div className="order-summary-card">
            <p className="order-summary-title">Order Summary</p>
            <div className="order-summary-selected">
              <div className="order-summary-tier-name">{activeTier.name}</div>
              <div className="order-summary-tier-price">{activeTier.price}</div>
            </div>
            <div className="order-summary-items">
              {activeTier.includes.map((item, idx) => (
                <div key={idx} className="order-summary-item">
                  <span className="order-summary-check">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="order-next-card">
            <p className="order-next-title">What Happens Next</p>
            <div className="order-next-steps">
              <div className="order-next-step">
                <div className="order-next-step-num">1</div>
                <p className="order-next-step-text">
                  Payment is confirmed via Stripe
                </p>
              </div>
              <div className="order-next-step">
                <div className="order-next-step-num">2</div>
                <p className="order-next-step-text">
                  Our designer reviews your brief within 1 business day
                </p>
              </div>
              <div className="order-next-step">
                <div className="order-next-step-num">3</div>
                <p className="order-next-step-text">
                  First concept delivered in 1–2 business days
                </p>
              </div>
              <div className="order-next-step">
                <div className="order-next-step-num">4</div>
                <p className="order-next-step-text">
                  Revisions and final file delivery
                </p>
              </div>
            </div>
          </div>

          <div className="order-secure-badge">
            <span className="order-stripe-icon">🔒</span>
            <span>
              256-bit SSL encrypted. Powered by Stripe — your card details
              are never stored on our servers.
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
