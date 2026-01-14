import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./TractorPage.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

// Imagini principale Tractor3
import tractor3_main from "../assets/images/tractoare/Tractor3_main.jpg";
import tractor3_1 from "../assets/images/tractoare/Tractor3_1.jpg";
import tractor3_2 from "../assets/images/tractoare/Tractor3_2.jpg";
import tractor3_3 from "../assets/images/tractoare/Tractor3_3.jpg";
import tractor3_4 from "../assets/images/tractoare/Tractor3_4.jpg";
import tractor3_5 from "../assets/images/tractoare/Tractor3_5.jpg";

// Miniaturi alte tractoare
import tractor1_thumb from "../assets/images/tractoare/Tractor1_main.jpg";
import tractor2_thumb from "../assets/images/tractoare/Tractor2_main.jpg";
import tractor4_thumb from "../assets/images/tractoare/Tractor4_main.jpg";
import tractor5_thumb from "../assets/images/tractoare/Tractor5_main.jpg";
import tractor6_thumb from "../assets/images/tractoare/Tractor6_main.jpg";

export default function Tractor3() {
  const [mainImage, setMainImage] = useState(tractor3_main);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  const images = [
    tractor3_main,
    tractor3_1,
    tractor3_2,
    tractor3_3,
    tractor3_4,
    tractor3_5
  ];

  // ✅ SPECIFICAȚII FIXED (în loc de specs undefined)
  const specs = [
    "Motor YUCHAI YC3Y3075-5580 — EURO V — 75 CP",
    "Transmisie sincronizată 12F + 12R",
    "Tracțiune integrală 4x4",
    "Capacitate ridicare hidraulică: 13.5 kN",
    "Frâne pe disc + frână parcare mecanică",
    "Cabină cu aer condiționat",
    "Rezervor 75 L"
  ];

  const otherTractors = [
    { id: 1, name: "Tractor 50 CAI HANWO 504, INMATRICULABIL 4X4 AC", thumb: tractor1_thumb },
    { id: 2, name: "Tractor 65 CAI HANWO 604, 4X4, STAGE 5+CARTE RAR INCLUSA", thumb: tractor2_thumb },
    { id: 4, name: "Tractor 50 CAI HANWO 504, 4X4, STAGE 5 cu încărcător frontal + CARTE RAR INCLUSA", thumb: tractor4_thumb },
    { id: 5, name: "Tractor HANWO 604, 65 CAI, 4X4, STAGE 5 cu încărcător frontal", thumb: tractor5_thumb },
    { id: 6, name: "Tractor Agricol HANWO 504R – 50 CP, 4×4 Euro 5", thumb: tractor6_thumb }
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const API_URL = import.meta.env.PROD 
      ? "https://hanwo-backend.onrender.com" 
      : "http://localhost:4000";
    
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "product-page",
          product: "Tractor 75 CAI HANWO 704"
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
    <div className="product-page">
      <Link to="/produse/tractoare" className="back-link">
        ← Înapoi la Tractoare
      </Link>

      {/* Imagine principală */}
      <div className="main-image">
        <img src={mainImage} alt="Tractor HANWO" />
      </div>

      {/* Galerie thumbnail-uri */}
      <div className="thumbnails-horizontal">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Tractor HANWO ${index}`}
            onClick={() => setMainImage(img)}
            className={img === mainImage ? "active-thumb" : ""}
          />
        ))}
      </div>

      <h1 className="red-title">
        Tractor 75 CAI HANWO 704, 4X4, STAGE 5 + CARTE RAR INCLUSA
      </h1>

      <p className="price">Preț de bază: 140,000.00 lei</p>

      {/* Descriere */}
      <div className="product-description">
        <p>
          Tractorul HANWO Model 704 oferă performanțe ridicate și fiabilitate
          pentru lucrări agricole complexe. Motor Yuchai YC3Y3075-5580,
          Euro V, 55.8–75 CP, cuplu maxim 220 Nm.
        </p>

        <div className="section-box">🔧 Performanță și eficiență</div>
        <p>Motor 2.998 L Turbo, rezervor 75 L, tracțiune 4WD.</p>

        <div className="section-box">⚙️ Transmisie și control</div>
        <p>Cutie sincronizată 12F + 12R, blocare diferențial mecanică.</p>

        <div className="section-box">🛠️ Sistem hidraulic</div>
        <p>Pompa 36–55 L/min, ridicare 13.5 kN, categoria II.</p>

        <div className="section-box">🚦 Siguranță și confort</div>
        <p>Frâne pe disc, cabină A/C, protecție anti-răsturnare.</p>

        <div className="section-box">🛞 Dimensiuni și greutate</div>
        <p>Greutate 3360 kg, garda la sol 360 mm, rază virare 4 m.</p>
      </div>

      {/* Specificații tehnice FIXED */}
      <h2>Specificații tehnice</h2>
      <ul className="specs">
        {specs.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

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
        <h2 className="other-tractors-title">Alte tractoare</h2>

        <div className="other-tractors">
          {otherTractors.map((t) => (
            <Link
              to={`/produse/tractoare/${t.id}`}
              key={t.id}
              className="other-tractor-card"
            >
              <img src={t.thumb} alt={t.name} />
              <p>{t.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
