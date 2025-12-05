import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./TractorPage.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

// Imagini simulate pentru Tractor2
import tractor2_main from "../assets/images/tractoare/Tractor2_main.jpg";
import tractor2_1 from "../assets/images/tractoare/Tractor2_1.jpg";
import tractor2_2 from "../assets/images/tractoare/Tractor2_2.jpg";
import tractor2_3 from "../assets/images/tractoare/Tractor2_3.jpg";
import tractor2_4 from "../assets/images/tractoare/Tractor2_4.jpg";
import tractor2_5 from "../assets/images/tractoare/Tractor2_5.jpg";

// Miniaturi alte tractoare
import tractor1_thumb from "../assets/images/tractoare/Tractor1_main.jpg";
import tractor3_thumb from "../assets/images/tractoare/Tractor3_main.jpg";
import tractor4_thumb from "../assets/images/tractoare/Tractor4_main.jpg";
import tractor5_thumb from "../assets/images/tractoare/Tractor5_main.jpg";
import tractor6_thumb from "../assets/images/tractoare/Tractor6_main.jpg";

export default function Tractor2() {
  const [mainImage, setMainImage] = useState(tractor2_main);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  const images = [tractor2_main, tractor2_1, tractor2_2, tractor2_3, tractor2_4, tractor2_5];

  const otherTractors = [
    { id: 1, name: "Tractor 50 CAI HANWO 504, INMATRICULABIL 4X4 AC", thumb: tractor1_thumb },
    { id: 3, name: "Tractor 75 CAI HANWO 704, 4X4, STAGE 5 + CARTE RAR INCLUSA", thumb: tractor3_thumb },
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
    try {
      const res = await fetch("http://localhost:4000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "product-page",
          product: "Tractor 65 CAI HANWO 604"
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
      <Link to="/produse/tractoare" className="back-link">← Înapoi la Tractoare</Link>

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

      <h1 className="red-title">Tractor 65 CAI HANWO 604, 4X4, STAGE 5+CARTE RAR INCLUSA</h1>
      <p className="price">Preț de bază: 135,000.00 lei</p>

      {/* Descriere cu chenare animate */}
      <div className="product-description">
        <p>Tractorul HANWO Model 604 oferă performanțe ridicate pentru toate lucrările agricole. Motor Yuchai YC3Y3065-5580, Euro V, 48–65 CP, cuplu maxim 196 Nm.</p>

        <div className="section-box">🔧 Performanță și eficiență</div>
        <p>Motor 2.998 L Turbo, rezervor 75 L, tracțiune 4WD, ambreiaj dublu stadiu, control precis și autonomie ridicată.</p>

        <div className="section-box">⚙️ Transmisie și control</div>
        <p>Cutie sincronizată 12F+12R, viteză înainte 1.49–25.70 km/h, marșarier 1.29–27.90 km/h, transmisie finală angreaj planetar, blocare diferențial mecanică.</p>

        <div className="section-box">🛠️ Sistem hidraulic</div>
        <p>Pompa 36–55 L/min, două grupuri supape, ridicător cu reglaj complet al forței și poziției, capacitate ridicare 13.5 kN, dispozitiv de lucru categoria II.</p>

        <div className="section-box">🚦 Siguranță și confort</div>
        <p>Frână pe disc, frână de parcare mecanică, cabină confortabilă cu A/C, sistem de protecție la răsturnare.</p>

        <div className="section-box">🛞 Dimensiuni și greutate</div>
        <p>Dimensiuni 4206×1782×2781 mm, ampatament 2050 mm, gardă la sol 360 mm, greutate minimă de lucru 3360 kg, rază de virare 4–4.5 m.</p>

        <div className="section-box">📦 Informații livrare și rate</div>
        <p>Adresă depozit: Milisauti, str. Gara 151, FN, județul Suceava. Se livrează oriunde în țară contra cost. Posibilitate achiziție în rate prin TBI Pay sau UniCredit. Condiții minime: salariat minim 3 luni, venit minim 1200 lei; pensionar venit minim 900 lei; vârstă 18–75 ani.</p>
      </div>

      {/* Formular Cerere Ofertă */}
      <div className="quote-request-section">
        <h2 className="section-title">Solicită Ofertă</h2>
        
        <div className="quote-container">
          <div className="contact-info-box">
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <h4>Locație</h4>
                <p>Str. Principală, nr.151</p>
                <p>Gara Milișăuți, Suceava</p>
              </div>
            </div>
            <div className="info-item">
              <FaClock className="info-icon" />
              <div>
                <h4>Program</h4>
                <p>Luni - Vineri: 09:00 - 18:00</p>
                <p>Sâmbătă: 09:00 - 14:00</p>
              </div>
            </div>
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div>
                <h4>Email</h4>
                <p>agrorus.brend@gmail.com</p>
              </div>
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
