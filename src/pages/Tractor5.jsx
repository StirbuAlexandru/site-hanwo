import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./TractorPage.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

// Imagini Tractor 604 + încărcător frontal
import tractor5_main from "../assets/images/tractoare/Tractor5_main.jpg";
import tractor5_1 from "../assets/images/tractoare/Tractor5_1.jpg";
import tractor5_2 from "../assets/images/tractoare/Tractor5_2.jpg";
import tractor5_3 from "../assets/images/tractoare/Tractor5_3.jpg";
import tractor5_4 from "../assets/images/tractoare/Tractor5_4.jpg";
import tractor5_5 from "../assets/images/tractoare/Tractor5_5.jpg";

// Miniaturi alte tractoare
import tractor1_thumb from "../assets/images/tractoare/Tractor1_main.jpg";
import tractor2_thumb from "../assets/images/tractoare/Tractor2_main.jpg";
import tractor3_thumb from "../assets/images/tractoare/Tractor3_main.jpg";
import tractor4_thumb from "../assets/images/tractoare/Tractor4_main.jpg";
import tractor5_thumb from "../assets/images/tractoare/Tractor5_main.jpg";

export default function Tractor5() {
  const [mainImage, setMainImage] = useState(tractor5_main);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const images = [tractor5_main, tractor5_1, tractor5_2, tractor5_3, tractor5_4, tractor5_5];

  const otherTractors = [
    { id: 1, name: "Tractor 50 CAI HANWO 504, INMATRICULABIL 4X4 AC", thumb: tractor1_thumb },
    { id: 2, name: "Tractor 65 CAI HANWO 604, 4X4, STAGE 5 + CARTE RAR INCLUSA", thumb: tractor2_thumb },
    { id: 3, name: "Tractor 75 CAI HANWO 704, 4X4, STAGE 5 + CARTE RAR INCLUSA", thumb: tractor3_thumb },
    { id: 4, name: "Tractor 50 CAI HANWO 504, 4X4, STAGE 5 cu încărcător frontal + CARTE RAR INCLUSA", thumb: tractor4_thumb },
    { id: 5, name: "Tractor HANWO 604, 65 CP, 4×4, Euro 5 + Încărcător frontal", thumb: tractor5_thumb }
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "product-page",
          product: "Tractor HANWO 604 cu încărcător frontal"
        }),
      });
      if (res.ok) {
        setFormSent(true);
        setForm({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setFormSent(false), 5000);
      }
    } catch (err) {
      console.error("Eroare la trimitere", err);
    }
  };

  return (
    <div className="product-page" style={{ paddingTop: "100px" }}>
      <Link to="/produse/tractoare" className="back-link">← Înapoi la Tractoare</Link>

      {/* Imagine principală */}
      <div className="main-image">
        <img src={mainImage} alt="Tractor HANWO 604" />
      </div>

      {/* Galerie thumbnail */}
      <div className="thumbnails-horizontal">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Tractor HANWO 604 - ${index}`}
            onClick={() => setMainImage(img)}
            className={img === mainImage ? "active-thumb" : ""}
          />
        ))}
      </div>

      <h1 className="red-title">Tractor Agricol HANWO 604 – 65 CP, 4×4 Euro 5 + Încărcător Frontal</h1>
      <p className="price">Preț de bază: 160,000.00 lei</p>

      {/* Descriere */}
      <div className="product-description">
        <p>
          HANWO 604 reprezintă combinația ideală între putere, confort și economie.
          Cu motor Euro 5 performant, tracțiune integrală 4×4 și încărcător frontal
          rezistent (capacitate ridicare până la 1200 kg), acest model este potrivit
          pentru ferme, zootehnie, construcții și lucrări municipale.
        </p>

        <div className="section-box">⚙️ Motor</div>
        <p>
          Motor Yuchai YC3Y3065-5580, Euro V, turbo. Putere nominală 48 kW (65 CP),
          turație 2400 rpm, cuplu maxim 196 Nm, cilindree 2.998 L. Rezervor combustibil 75 L.
        </p>

        <div className="section-box">🛞 Transmisie & tracțiune</div>
        <p>
          Tracțiune 4×4 (4WD), ambreiaj 11 inch cu două trepte, cutie sincronizată 12F+12R.
          Viteză înainte: 1.49–25.70 km/h. Viteză marșarier: 1.29–27.90 km/h.
          Transmisie finală cu angrenaj planetar, blocare diferențial mecanică.
        </p>

        <div className="section-box">🛢️ Sistem hidraulic</div>
        <p>
          Debit pompă hidraulică 36–55 L/min, două supape spate, ridicare 3 puncte Cat. II,
          capacitate ridicare 13.5 kN, PTO independent 540/1000.
        </p>

        <div className="section-box">📏 Dimensiuni & greutate</div>
        <p>
          Dimensiuni (L×l×h): 4206×1782×2781 mm (cabina). Ampatament 2050 mm,
          ecartament față 1320 mm, spate 1400 mm, gardă la sol 360 mm.
          Greutate structură 3180 kg, greutate minimă lucru 3360 kg.
        </p>

        <div className="section-box">🛞 Anvelope</div>
        <p>
          Standard față 7.5–16, spate 380/70R28.
          Opționale: 280/70R16 380/85R24, 280/70R18 380/70R28, 280/70R20 380/85R28.
        </p>

        <div className="section-box">✅ Echipare & siguranță</div>
        <p>
          Cabină cu aer condiționat, sistem ROPS, frâne pe disc, frână de parcare mecanică.
          Încărcător frontal cu cupă graifer — ridicare până la 1200 kg.
        </p>
      </div>

      {/* Formular Cerere Ofertă */}
      <div className="quote-request-section">
        <h2 className="section-title">Solicită Ofertă</h2>
        <div className="quote-container">
          <div className="contact-info-box">
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div><h4>Locație</h4><p>Str. Principală, nr.151</p><p>Gara Milișăuți, Suceava</p></div>
            </div>
            <div className="info-item">
              <FaClock className="info-icon" />
              <div><h4>Program</h4><p>Luni - Vineri: 09:00 - 18:00</p><p>Sâmbătă: 09:00 - 14:00</p></div>
            </div>
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div><h4>Email</h4><p>agrorus.brend@gmail.com</p></div>
            </div>
            <div className="contact-buttons">
              <a href="tel:+40741220030" className="call-button"><FaPhone /> +40 741 220 030</a>
              <a href="tel:+40759076654" className="call-button"><FaPhone /> +40 759 076 654</a>
              <a href="tel:+40755458160" className="call-button"><FaPhone /> +40 755 458 160</a>
            </div>
          </div>
          <div className="quote-form-box">
            <form className="quote-form" onSubmit={handleFormSubmit}>
              <h3>Trimite-ne o cerere</h3>
              {formSent && <div className="success-message">Cererea ta a fost trimisă! Te vom contacta în curând.</div>}
              <input type="text" name="name" placeholder="Nume complet *" value={form.name} onChange={handleFormChange} required />
              <input type="email" name="email" placeholder="Email *" value={form.email} onChange={handleFormChange} required />
              <input type="tel" name="phone" placeholder="Telefon *" value={form.phone} onChange={handleFormChange} required />
              <textarea name="message" placeholder="Mesajul tău (opțional)" value={form.message} onChange={handleFormChange} rows="4" />
              <button type="submit" className="submit-button">Trimite Cererea</button>
            </form>
          </div>
        </div>
      </div>

      {/* Alte tractoare */}
      <div className="other-tractors-section">
        <h2
          className="other-tractors-title"
          style={{ color: "#ff1e1e", textAlign: "center", fontSize: "2rem", marginBottom: "30px" }}
        >
          Alte tractoare
        </h2>
        <div className="other-tractors">
          {otherTractors.map((t) => (
            <Link to={`/produse/tractoare/${t.id}`} key={t.id} className="other-tractor-card">
              <img src={t.thumb} alt={t.name} />
              <p>{t.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
