"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { teamMembers } from "@/lib/data";
import "./TeamMemberPage.css";

interface TeamMemberPageProps {
  slug: string;
}

export default function TeamMemberPage({ slug }: TeamMemberPageProps) {
  const member = teamMembers.find((m) => m.slug === slug);
  const bgRef = useRef<HTMLDivElement>(null);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!bgRef.current) return;
      const scrollY = window.scrollY;
      bgRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!member) {
    return (
      <div
        style={{
          padding: "200px 40px",
          textAlign: "center",
          color: "var(--text-secondary)",
        }}
      >
        <h1>Team member not found</h1>
        <Link href="/about-us" style={{ color: "var(--gold)" }}>
          ← Back to About
        </Link>
      </div>
    );
  }

  const others = teamMembers.filter((m) => m.slug !== slug);

  return (
    <>
      {/* Parallax Hero */}
      <section className="team-hero">
        <div className="team-hero-bg" ref={bgRef}>
          <Image
            src={member.heroBg}
            alt={member.name}
            fill
            style={{ objectFit: "cover", objectPosition: "center top" }}
            priority
            unoptimized
          />
        </div>
        <div className="team-hero-overlay" />
        <div className="team-hero-content">
          <p className="team-hero-eyebrow">The Team</p>
          <h1 className="team-hero-name">{member.name}</h1>
          <p className="team-hero-role">{member.role}</p>
        </div>
      </section>

      {/* Bio section */}
      <section className="team-bio">
        <div className="team-bio-inner">
          <div className="team-bio-sidebar">
            <div className="team-bio-photo">
              <Image
                src={member.image}
                alt={member.name}
                fill
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </div>
            <div className="team-bio-links">
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="team-bio-link"
              >
                Instagram — @logoprofessionals
                <span>↗</span>
              </a>
              {member.website && (
                <a
                  href={member.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-bio-link"
                >
                  Personal Website
                  <span>↗</span>
                </a>
              )}
              <Link href="/contact-us" className="team-bio-link">
                Work Together
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="team-bio-content">
            <p className="team-bio-eyebrow">About</p>
            <h2 className="team-bio-name">{member.name}</h2>
            <p className="team-bio-role-tag">{member.role}</p>

            <div className="team-bio-quote">
              <p>&ldquo;{member.quote}&rdquo;</p>
            </div>

            <p className="team-bio-text">{member.bio}</p>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      {member.portfolio.length > 0 && (
        <section className="team-portfolio">
          <div className="team-portfolio-inner">
            <div className="team-portfolio-header">
              <p className="team-portfolio-eyebrow">Selected Work</p>
              <h2 className="team-portfolio-title">
                {member.name.split(" ")[0]}&apos;s Portfolio
              </h2>
            </div>
            <div className="team-portfolio-grid">
              {member.portfolio.map((item, idx) => (
                <div key={idx} className="team-portfolio-item">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                  <div className="team-portfolio-item-caption">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Meet other team members */}
      <section className="team-nav-bottom">
        <div className="team-nav-bottom-inner">
          <p className="team-nav-bottom-text">Meet the rest of the team</p>
          <div className="team-nav-links">
            {others.map((m) => (
              <Link
                key={m.slug}
                href={`/about-us/${m.slug}`}
                className="team-nav-link"
              >
                {m.name}
              </Link>
            ))}
            <Link href="/contact-us" className="team-nav-link">
              Work With Us →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
