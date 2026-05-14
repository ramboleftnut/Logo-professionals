import { testimonials } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import "./Testimonials.css";

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="testimonials-header">
        <SectionHeading
          eyebrow="Client Reviews"
          title="Trusted by brands across the globe."
          align="center"
        />
      </div>

      <div className="testimonials-grid">
        {testimonials.map((t) => (
          <div key={t.id} className="testimonial-card">
            <span className="testimonial-quote-icon">&ldquo;</span>
            <div className="testimonial-stars">
              {Array.from({ length: t.stars }).map((_, i) => (
                <span key={i} className="star">★</span>
              ))}
            </div>
            <p className="testimonial-text">{t.text}</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">
                {t.name.charAt(0)}
              </div>
              <div>
                <div className="testimonial-name">{t.name}</div>
                {t.company && (
                  <div className="testimonial-company">{t.company}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
