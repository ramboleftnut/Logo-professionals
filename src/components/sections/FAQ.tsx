"use client";

import { useState } from "react";
import { faq } from "@/lib/data";
import "./FAQ.css";

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="faq-section">
      <div className="faq-inner">
        <div className="faq-sidebar">
          <p className="faq-eyebrow">FAQ</p>
          <h2 className="faq-title">Common Questions</h2>
          <p className="faq-sidebar-desc">
            Everything you need to know about working with us. Can't find the
            answer you're looking for?{" "}
            <a href="/contact-us" style={{ color: "var(--gold)" }}>
              Contact us directly.
            </a>
          </p>
        </div>

        <div className="faq-list">
          {faq.map((item, idx) => (
            <div key={idx} className="faq-item">
              <button
                className="faq-question"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              >
                {item.question}
                <span className={`faq-icon ${openIdx === idx ? "open" : ""}`}>
                  +
                </span>
              </button>
              <div className={`faq-answer ${openIdx === idx ? "open" : ""}`}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
