"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "./NavBar.css";

interface NavBarTeamMember {
  name: string;
  slug: string;
}

export default function NavBar({ team }: { team: NavBarTeamMember[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/admin-check")
      .then((res) => res.json())
      .then((data) => setIsAdmin(data.isAdmin))
      .catch(() => setIsAdmin(false));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <Image src="/logo.svg" width={130} height={100} alt="logoproffesionals logo" />
        </Link>

        <ul className="navbar-links">
          <li><Link href="/our-clients">Our Work</Link></li>
          <li className="nav-dropdown">
            <Link href="/about-us">About Us</Link>
            <div className="nav-dropdown-menu">
              <Link href="/about-us">About Us</Link>
              {team.map((m) => (
                <Link key={m.slug} href={`/about-us/${m.slug}`}>{m.name}</Link>
              ))}
            </div>
          </li>
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/contact-us">Contact</Link></li>
          {isAdmin && <li><Link href="/admin">Admin</Link></li>}
        </ul>

        <button
          className={`nav-hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link href="/our-clients" onClick={() => setMenuOpen(false)}>Our Work</Link>
        <Link href="/about-us" onClick={() => setMenuOpen(false)}>About Us</Link>
        <div className="mobile-sub">
          {team.map((m) => (
            <Link key={m.slug} href={`/about-us/${m.slug}`} onClick={() => setMenuOpen(false)}>
              {m.name.split(" ")[0]}
            </Link>
          ))}
        </div>
        <Link href="/services" onClick={() => setMenuOpen(false)}>Services</Link>
        <Link href="/contact-us" onClick={() => setMenuOpen(false)}>Contact</Link>
        {isAdmin && (
          <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
        )}
      </div>
    </>
  );
}
