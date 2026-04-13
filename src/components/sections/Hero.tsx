"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import "./Hero.css";

interface HeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  videoSrc?: string;
}

export default function Hero({
  eyebrow = "Expert Logo Design Studio",
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  videoSrc = "/Final_6_2.mp4",
}: HeroProps) {
  const [faded, setFaded] = useState(false);
  const [duration, setDuration] = useState("2s");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scheduleHide() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDuration("2s");
      setFaded(true);
    }, 4000);
  }

  useEffect(() => {
    scheduleHide();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleInteraction() {
    if (faded) {
      setDuration("0.3s");
      setFaded(false);
    }
    scheduleHide();
  }

  return (
    <section
      className="hero"
      onMouseMove={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {videoSrc ? (
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.jpg"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <div className="hero-bg-fallback" />
      )}
      <div className="hero-overlay" />

      <div
        className={`hero-content${faded ? " hero-content--faded" : ""}`}
        style={{ transition: `opacity ${duration} ease` }}
      >
        {eyebrow && (
          <p className="hero-eyebrow">
            {eyebrow}
          </p>
        )}

        <h1 className="hero-title">{title}</h1>

        {subtitle && <p className="hero-subtitle">{subtitle}</p>}

        {(primaryCta || secondaryCta) && (
          <div className="hero-actions">
            {primaryCta && (
              <Button href={primaryCta.href} variant="primary" size="lg">
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button href={secondaryCta.href} variant="outline" size="lg">
                {secondaryCta.label}
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="hero-scroll">
        <div className="hero-scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
