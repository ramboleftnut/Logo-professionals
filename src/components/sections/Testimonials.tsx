import { testimonials } from "@/lib/data";
import "./Testimonials.css";

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="testimonials-header">
        <p className="testimonials-eyebrow">Client Reviews</p>
        <h2 className="testimonials-title">
          Trusted by brands across the globe.
        </h2>
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
