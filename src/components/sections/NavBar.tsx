"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./NavBar.css";
import Image from "next/image";

const navLinks = [
  { label: "Our Work", href: "/our-clients" },
  {
    label: "About Us",
    href: "/about-us",
    dropdown: [
      { label: "About Us", href: "/about-us" },
      { label: "Niko Dola", href: "/about-us/niko-dola" },
      { label: "Alekxa Dola", href: "/about-us/alekxa-dola" },
      { label: "Igor Dola", href: "/about-us/igor-dola" },
    ],
  },
  { label: "Contact", href: "/contact-us" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
          <Image src={"/logo.svg"} width={130} height={100} alt="logoproffesionals logo"></Image>
        </Link>

        <ul className="navbar-links">
          {navLinks.map((link) =>
            link.dropdown ? (
              <li key={link.href} className="nav-dropdown">
                <Link href={link.href}>{link.label}</Link>
                <div className="nav-dropdown-menu">
                  {link.dropdown.map((sub) => (
                    <Link key={sub.href} href={sub.href}>
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </li>
            ) : (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            )
          )}
          <li>
            <Link href="/logo-design" className="nav-cta">
              Get a Logo
            </Link>
          </li>
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
        <Link href="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link href="/our-clients" onClick={() => setMenuOpen(false)}>
          Our Work
        </Link>
        <Link href="/about-us" onClick={() => setMenuOpen(false)}>
          About Us
        </Link>
        <div className="mobile-sub">
          <Link href="/about-us/niko-dola" onClick={() => setMenuOpen(false)}>
            Niko
          </Link>
          <Link href="/about-us/alekxa-dola" onClick={() => setMenuOpen(false)}>
            Alekxa
          </Link>
          <Link href="/about-us/igor-dola" onClick={() => setMenuOpen(false)}>
            Igor
          </Link>
        </div>
        <Link href="/contact-us" onClick={() => setMenuOpen(false)}>
          Contact
        </Link>
        <Link href="/logo-design" onClick={() => setMenuOpen(false)}>
          Get a Logo
        </Link>
      </div>
    </>
  );
}
