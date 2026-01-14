import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./TractorPage.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { API_URL } from "../config";

// Imagini Tractor6
import tractor6_main from "../assets/images/tractoare/Tractor6_main.jpg";
import tractor6_1 from "../assets/images/tractoare/Tractor6_1.jpg";
import tractor6_2 from "../assets/images/tractoare/Tractor6_2.jpg";
import tractor6_3 from "../assets/images/tractoare/Tractor6_3.jpg";

// Miniaturi alte tractoare
import tractor1_thumb from "../assets/images/tractoare/Tractor1_main.jpg";
import tractor2_thumb from "../assets/images/tractoare/Tractor2_main.jpg";
import tractor3_thumb from "../assets/images/tractoare/Tractor3_main.jpg";
import tractor4_thumb from "../assets/images/tractoare/Tractor4_main.jpg";
import tractor5_thumb from "../assets/images/tractoare/Tractor5_main.jpg";

export default function Tractor6() {
  const [mainImage, setMainImage] = useState(tractor6_main);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const images = [tractor6_main, tractor6_1, tractor6_2, tractor6_3];

  const specs = {
    "Motor": "YN4H055-30VE",
    "Tip motor": "Vertical, răcit cu apă, în 4 timpi",
    "Putere nominală/maximă": "36,8 kW / 50 CP",
    "Turație nominală/maximă": "2400 rpm",
    "Rezervor combustibil": "40 L",
    "Lungime totală": "3810 mm",
    "Lățime": "1495 mm",
    "Înălțime": "2596 mm (cu bară antiruliu)",
    "Ampatament": "1809 mm",
    "Gardă minimă la sol": "215 mm",
    "Bandă față": "1160 mm",
    "Bandă spate": "1200 mm",
    "Greutate": "2260 kg",
    "Ambreiaj": "cu frecare uscată, cu două trepte",
    "Anvelope față": "280/70R16",
    "Anvelope spate": "360/71R24",
    "Direcție": "hidraulică",
    "Transmisie": "cu trepte de viteză, 8 înainte și 8 înapoi + schimbare sincronizată",
    "Debit hidraulic": "36 L/min",
    "Sistem de control hidraulic": "semi-divizat, ridicare reglabilă într-o singură poziție",
    "Comandă spate": "două grupuri, cuplaj rapid hidraulic",
    "Putere priză de putere": "540/1000",
    "Tracțiune": "4×4 (4WD)",
    "Viteză maximă": "1,99–28,37 km/h"
  };

  const otherTractors = [
    { id: 1, name: "Tractor 50 CAI HANWO 504, INMATRICULABIL 4X4 AC", thumb: tractor1_thumb },
    { id: 2, name: "Tractor 65 CAI HANWO 604, 4X4, STAGE 5+CARTE RAR INCLUSA", thumb: tractor2_thumb },
    { id: 3, name: "Tractor 75 CAI HANWO 704, 4X4, STAGE 5 + CARTE RAR INCLUSA", thumb: tractor3_thumb },
    { id: 4, name: "Tractor 50 CAI HANWO 504, 4X4, STAGE 5 cu încărcător frontal + CARTE RAR INCLUSA", thumb: tractor4_thumb },
    { id: 5, name: "Tractor HANWO 604, 65 CAI, 4X4, STAGE 5 cu încărcător frontal", thumb: tractor5_thumb }
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "product-page",
          product: "Tractor HANWO 504R"
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

      <div className="main-image">
        <img src={mainImage} alt="Tractor HANWO" />
      </div>

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

      <h1 className="red-title">Tractor Agricol HANWO 504R – 50 CP, 4×4 Euro 5</h1>
      <p className="price">Preț de bază: 90,000.00 lei</p>

      <div className="product-description">
        <p>Tractorul HANWO Model 504R oferă performanță fiabilă și durabilitate în toate condițiile agricole, cu motor vertical răcit cu apă și tracțiune 4x4.</p>

        <div className="section-box">⚙️ Motor</div>
        <p>Motor YN4H055-30VE, vertical, răcit cu apă, în 4 timpi. Putere nominală/maximă: 36,8 kW / 50 CP. Turație nominală/maximă: 2400 rpm. Rezervor combustibil: 40 L.</p>

        <div className="section-box">🛞 Dimensiuni</div>
        <p>Lungime totală: 3810 mm, lățime: 1495 mm, înălțime: 2596 mm (cu bară antiruliu), ampatament: 1809 mm, gardă minimă la sol: 215 mm, bandă față: 1160 mm, bandă spate: 1200 mm, greutate: 2260 kg.</p>

        <div className="section-box">⚙️ Transmisie și tracțiune</div>
        <p>Ambreiaj cu frecare uscată, două trepte. Anvelope față 280/70R16, spate 360/71R24. Direcție hidraulică. Transmisie cu trepte de viteză, 8 înainte și 8 înapoi + schimbare sincronizată. Tracțiune 4×4 (4WD). Viteză maximă: 1,99–28,37 km/h.</p>

        <div className="section-box">🛠️ Sistem hidraulic</div>
        <p>Debit hidraulic: 36 L/min, sistem semi-divizat, ridicare reglabilă într-o singură poziție, comandă spate: două grupuri, cuplaj rapid hidraulic. Putere priză de putere: 540/1000.</p>
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
