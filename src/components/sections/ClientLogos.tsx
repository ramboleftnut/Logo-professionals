import Image from "next/image";
import { clientLogos } from "@/lib/data";
import "./ClientLogos.css";

export default function ClientLogos() {
  // Duplicate for seamless infinite scroll
  const doubled = [...clientLogos, ...clientLogos];

  return (
    <div className="client-logos">
      <p className="client-logos-label">Trusted by brands worldwide</p>
      <div className="client-logos-track-wrapper">
        <div className="client-logos-track">
          {doubled.map((logo, idx) => (
            <a
              key={idx}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="client-logo-item"
              aria-label={logo.name}
            >
              <Image
                src={logo.image}
                alt={logo.name}
                width={113}
                height={48}
                style={{ objectFit: "contain", height: "48px", width: "auto" }}
                unoptimized
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
