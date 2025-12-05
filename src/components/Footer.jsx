import React, { useState } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import campie from "../assets/images/campie.jpg";

// ANPC IMAGES
import anpc from "../assets/images/anpc-img.png";
import sol from "../assets/images/sol-img-icon.png";

import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="footer"
      style={{ backgroundImage: `url(${campie})` }}
    >
      <div className="footer-overlay">
        <div className="footer-container">

          {/* Coloana 1: Contact */}
          <div className="footer-col fade fade-delay-1">
            <h3>Contact</h3>
            <p>HANWO România</p>
            <p>Str. Principală, nr.151, sat Gara Milișăuți, Suceava</p>
            <p>Telefon:</p>
            <p>+40 741 220 030</p>
            <p>+40 759 076 654</p>
            <p>+40 755 458 160</p>
            <p>Email: agrorus.brend@gmail.com</p>
          </div>

          {/* Coloana 2: Linkuri rapide */}
          <div className="footer-col fade fade-delay-2">
            <h3>Linkuri rapide</h3>
            <ul>
              <li><Link to="/">Acasă</Link></li>
              <li><Link to="/despre-noi">Despre noi</Link></li>
              <li><Link to="/produse/tractoare">Produse</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Coloana 3: Social media */}
          <div className="footer-col fade fade-delay-3">
            <h3>Urmărește-ne</h3>
            <div className="social-icons">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaTiktok /></a>
              <a href="#"><FaYoutube /></a>
            </div>
          </div>

          {/* Coloana 4: Formular */}
          <div className="footer-col fade fade-delay-4">
            <h3>Trimite-ne un mesaj rapid</h3>
            <FooterContactForm />
          </div>
        </div>

        {/* LOGO-URI ANPC & SOL cu link extern */}
        <div className="anpc-logos">
          <a href="https://anpc.ro/ce-este-sal/?_ga=2.141123634.1405796489.1718727746-2018146410.1717702664" target="_blank" rel="noopener noreferrer">
            <img src={anpc} alt="ANPC" />
          </a>
          <a href="https://consumer-redress.ec.europa.eu/site-relocation_en?event=main.home2.show&lng=RO&_ga=2.254878728.1405796489.1718727746-2018146410.1717702664" target="_blank" rel="noopener noreferrer">
            <img src={sol} alt="SOL NPC" />
          </a>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} HANWO România. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  );
}

/* Formular contact */
function FooterContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Completează nume, email și un mesaj scurt.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "footer" }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError((data && data.error) || `Server returned ${res.status}`);
      } else {
        setSent(true);
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setSent(false), 5000);
      }
    } catch (err) {
      console.error(err);
      setError("Eroare la trimitere. Încearcă mai târziu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      {sent && <div className="form-success">Mesaj trimis!</div>}
      {error && <div className="form-error">{error}</div>}
      <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Nume" required />
      <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email" required />
      <input name="message" value={form.message} onChange={handleChange} placeholder="Mesaj scurt" required />
      <button type="submit" disabled={loading}>{loading ? "Se trimite..." : "Trimite"}</button>
    </form>
  );
}
