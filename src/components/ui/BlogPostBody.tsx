"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CompareSlider from "./CompareSlider";
import type { ContentBlock } from "@/lib/content";

function splitParagraphs(text: string) {
  return text.split(/\n\n+/).filter(Boolean);
}

function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="blog-post-content">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "section":
            return (
              <section key={i} className="bp-section">
                {block.heading && <h2>{block.heading}</h2>}
                {splitParagraphs(block.body).map((p, j) => <p key={j}>{p}</p>)}
              </section>
            );

          case "banner":
            return (
              <div key={i} className="bp-banner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={block.src} alt={block.alt || ""} />
              </div>
            );

          case "split":
            return (
              <div key={i} className={`bp-split${block.layout === "right" ? " bp-split--reverse" : ""}`}>
                <div className="bp-split-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={block.src} alt={block.alt || ""} />
                </div>
                <div className="bp-split-text">
                  {block.heading && <h3>{block.heading}</h3>}
                  {splitParagraphs(block.body).map((p, j) => <p key={j}>{p}</p>)}
                </div>
              </div>
            );

          case "card-grid":
            return (
              <div key={i} className="bp-grid">
                {block.cards.map((card, j) => (
                  <div key={j} className="bp-card">
                    {card.src && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={card.src} alt={card.heading} />
                    )}
                    <div className="bp-card-body">
                      <h3>{card.heading}</h3>
                      {splitParagraphs(card.body).map((p, k) => <p key={k}>{p}</p>)}
                    </div>
                  </div>
                ))}
              </div>
            );

          case "highlight":
            return (
              <div key={i} className={`bp-highlight${block.variant === "rose" ? " bp-highlight--rose" : ""}`}>
                <h2>{block.heading}</h2>
                {splitParagraphs(block.body).map((p, j) => <p key={j}>{p}</p>)}
              </div>
            );

          case "quote":
            return (
              <blockquote key={i} className="bp-quote">
                {block.text}
              </blockquote>
            );

          case "compare":
            return (
              <div key={i} className="bp-compare">
                <CompareSlider
                  before={block.before}
                  after={block.after}
                  beforeAlt={block.beforeAlt}
                  afterAlt={block.afterAlt}
                  beforeLabel={block.beforeLabel}
                  afterLabel={block.afterLabel}
                />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

interface Props {
  html?: string;
  blocks?: ContentBlock[];
}

type ComparePortal = {
  target: HTMLElement;
  before: string;
  after: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
};

export default function BlogPostBody({ html, blocks }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [comparePortals, setComparePortals] = useState<{
    html?: string;
    items: ComparePortal[];
  }>({ items: [] });

  useEffect(() => {
    if (blocks?.length || !html) return;

    const root = ref.current;
    if (!root) return;
    let cancelled = false;

    const markers = Array.from(
      root.querySelectorAll<HTMLElement>("[data-compare]"),
    );
    const items: ComparePortal[] = [];

    markers.forEach((marker) => {
      const before = marker.getAttribute("data-before");
      const after = marker.getAttribute("data-after");
      if (!before || !after) return;

      const beforeAlt = marker.getAttribute("data-before-alt") || undefined;
      const afterAlt = marker.getAttribute("data-after-alt") || undefined;
      const beforeLabel = marker.getAttribute("data-before-label") || undefined;
      const afterLabel = marker.getAttribute("data-after-label") || undefined;

      marker.innerHTML = "";
      items.push({
        target: marker,
        before,
        after,
        beforeAlt,
        afterAlt,
        beforeLabel,
        afterLabel,
      });
    });

    queueMicrotask(() => {
      if (!cancelled) {
        setComparePortals({ html, items });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [html, blocks]);

  if (blocks?.length) {
    return <BlockRenderer blocks={blocks} />;
  }

  if (!html) return null;

  return (
    <>
      <div
        ref={ref}
        className="blog-post-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {comparePortals.html === html &&
        comparePortals.items.map((item, i) =>
          createPortal(
            <CompareSlider
              before={item.before}
              after={item.after}
              beforeAlt={item.beforeAlt}
              afterAlt={item.afterAlt}
              beforeLabel={item.beforeLabel}
              afterLabel={item.afterLabel}
            />,
            item.target,
            `compare-${i}`,
          ),
        )}
    </>
  );
}
