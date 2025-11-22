import { testimonials } from "../utils/data";

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <h2>Ce spun clienții</h2>
      <div className="testimonials-list">
        {testimonials.map((t) => (
          <blockquote key={t.id}>
            <p>"{t.quote}"</p>
            <footer>— {t.name}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
