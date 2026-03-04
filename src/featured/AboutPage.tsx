import Image from "next/image";
import Link from "next/link";
import Testimonials from "@/components/sections/Testimonials";
import { teamMembers } from "@/lib/data";
import "./AboutPage.css";

const benefits = [
  "Stand out from the competition with a unique and memorable logo",
  "Create a strong brand identity that resonates with your target audience",
  "Ensure your logo is versatile across all mediums and platforms",
  "Receive expert guidance on color, typography, and design elements",
  "Save time and money by avoiding costly mistakes and redesigns",
];

const values = [
  {
    title: "Detail Oriented",
    desc: "We make a conscious effort to understand aesthetics — not just what's trending. Every pixel matters.",
  },
  {
    title: "Research Driven",
    desc: "We study your industry, your audience, and your competitors to craft something that genuinely stands apart.",
  },
  {
    title: "Complete Delivery",
    desc: "Every project delivers vector source files, high-res exports, and everything you need to use your brand anywhere.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <div>
            <p className="about-hero-eyebrow">About Us</p>
            <h1 className="about-hero-title">
              Logo Design:
              <br />
              Art Meets
              <br />
              Technology
            </h1>
            <p className="about-hero-text">
              We are a team of professional logo designers who specialize in
              branding and visual identity. At its core, logo design is a blend
              of artistic creativity and technological precision.
            </p>
            <p className="about-hero-text">
              A well-designed logo communicates your company&apos;s values,
              mission, and story through imagery — making it a crucial part of
              any brand&apos;s identity. We&apos;ve done this for over 374
              clients across 36 countries.
            </p>
          </div>
          <div className="about-hero-image">
            <Image
              src="https://thelogoprofessionals.com/wp-content/uploads/2020/05/goran-ivos-iY9g8EcikeY-unsplash.jpg"
              alt="Logo design workspace"
              fill
              style={{ objectFit: "cover", filter: "grayscale(20%)" }}
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="about-values-inner">
          <div className="about-values-header">
            <p className="about-section-eyebrow">Our Approach</p>
            <h2 className="about-section-title">
              We appreciate a professional approach
            </h2>
          </div>
          <div className="about-values-grid">
            {values.map((v, idx) => (
              <div key={idx} className="about-value-card">
                <div className="about-value-number">
                  0{idx + 1}
                </div>
                <h3 className="about-value-title">{v.title}</h3>
                <p className="about-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="about-benefits">
        <div className="about-benefits-inner">
          <div>
            <p className="about-section-eyebrow">Why Work With Us</p>
            <h2 className="about-benefits-title">
              The Power of Visual Design
            </h2>
            <p className="about-benefits-desc">
              Visual design is a powerful tool that can make or break a
              business. No matter how great your products or services are, if
              you don&apos;t present them professionally, you&apos;re already at
              a disadvantage.
            </p>
          </div>
          <ul className="about-benefits-list">
            {benefits.map((b, idx) => (
              <li key={idx}>
                <span className="about-benefit-check">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Team */}
      <section className="about-team">
        <div className="about-team-inner">
          <div className="about-team-header">
            <p className="about-section-eyebrow">The Team</p>
            <h2 className="about-section-title">Meet the Designers</h2>
          </div>
          <div className="about-team-grid">
            {teamMembers.map((member) => (
              <Link
                key={member.slug}
                href={`/about-us/${member.slug}`}
                className="about-team-card"
              >
                <div className="about-team-card-image">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                </div>
                <div className="about-team-card-info">
                  <div className="about-team-card-name">{member.name}</div>
                  <div className="about-team-card-role">{member.role}</div>
                  <span className="about-team-card-arrow">View Profile →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
    </>
  );
}
