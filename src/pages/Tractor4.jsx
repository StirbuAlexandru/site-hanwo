import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./TractorPage.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { API_URL } from "../config";

// Imagini simulate pentru Tractor4
import tractor4_main from "../assets/images/tractoare/Tractor4_main.jpg";
import tractor4_1 from "../assets/images/tractoare/Tractor4_1.jpg";
import tractor4_2 from "../assets/images/tractoare/Tractor4_2.jpg";
import tractor4_3 from "../assets/images/tractoare/Tractor4_3.jpg";
import tractor4_4 from "../assets/images/tractoare/Tractor4_4.jpg";
import tractor4_5 from "../assets/images/tractoare/Tractor4_5.jpg";

// Miniaturi alte tractoare
import tractor2_thumb from "../assets/images/tractoare/Tractor2_main.jpg";
import tractor3_thumb from "../assets/images/tractoare/Tractor3_main.jpg";
import tractor5_thumb from "../assets/images/tractoare/Tractor5_main.jpg";
import tractor6_thumb from "../assets/images/tractoare/Tractor6_main.jpg";

export default function Tractor4() {
  const [mainImage, setMainImage] = useState(tractor4_main);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  const images = [tractor4_main, tractor4_1, tractor4_2, tractor4_3, tractor4_4, tractor4_5];

  const specs = {
    "Model motor": "Yunnei DFD20",
    "Standard emisii": "Euro V",
    "Putere nominală": "36.8 kW",
    "Turație nominală": "2400 rpm",
    "Cuplu maxim": "190 Nm",
    "Capacitate cilindrică": "2.5 L",
    "Tip admisie aer": "Turbo",
    "Capacitate rezervor combustibil": "60 L",
    "Tip tracțiune": "AWD",
    "Tip ambreiaj": "Uscat, dublu stadiu",
    "Cutie de viteze": "SINCRONIZATĂ, 8F+8R",
    "Viteză înainte": "1.99–28.37 km/h",
    "Viteză marșarier": "1.79–25.53 km/h",
    "Transmisie finală": "Integrală, angrenaj cilindric simplu",
    "Blocare diferențial": "Mecanică",
    "Tip frână": "Umedă, pe disc",
    "Frână de parcare": "Mecanică",
    "Debit pompă hidraulică": "36–55 L/min",
    "Număr supape control": "Două grupuri, cuplare rapidă",
    "Control ridicător": "Poziție / plutitor",
    "Capacitate ridicare": "8.3 kN",
    "Cârlig spate": "Categoria I",
    "Tip PTO": "540 / 1000",
    "Trepte PTO": "6",
    "Anvelope standard față": "7.5–16",
    "Anvelope standard spate": "12.4–24",
    "Anvelope opționale": "260/70R16 320/85R24, 280/70R16 360/70R24",
    "Sistem protecție la răsturnare": "Da",
    "Cabină": "Cabină cu A/C",
    "Dimensiuni (L×l×h)": "3810×1495×2596 (ROPS)",
    "Ampatament": "1809 mm",
    "Ecartament față": "1180–1380 mm",
    "Ecartament spate": "1200–1400 mm",
    "Gardă la sol": "215 mm",
    "Rază de virare": "3.5 m",
    "Greutate structură": "2260 kg",
    "Greutate min. în lucru": "2420 kg",
    "Greutate față": "100 kg",
    "Greutate spate": "56 kg",
    "Încărcător frontal": "Cupa graifer până la 750 kg"
  };

  const otherTractors = [
    { id: 2, name: "Tractor 65 CAI HANWO 604, 4X4, STAGE 5+CARTE RAR INCLUSA", thumb: tractor2_thumb },
    { id: 3, name: "Tractor 75 CAI HANWO 704, 4X4, STAGE 5 + CARTE RAR INCLUSA", thumb: tractor3_thumb },
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
      const res = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "product-page",
          product: "Tractor 50 CAI HANWO 504 cu încărcător frontal"
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

      <h1 className="red-title">Tractor 50 CAI HANWO 504, 4X4, STAGE 5 cu încărcător frontal + CARTE RAR INCLUSA</h1>
      <p className="price">Preț de bază: 138,000.00 lei</p>

      {/* Descriere cu chenare animate */}
      <div className="product-description">
        <p>Încărcător frontal cu cupa graifer ce poate ridica până la 750 kg.</p>

        <div className="section-box">📦 Informații livrare și rate</div>
        <p>Adresă depozit: Milisauti, str. Gara 151, FN, județul Suceava. Se livrează oriunde în țară contra cost (prețul de livrare se comunică telefonic). Achiziție în rate prin TBI Pay sau UniCredit. Condiții minime: salariat minim 3 luni, venit minim 1200 lei; pensionar venit minim 900 lei; vârstă 18–75 ani.</p>
      </div>

      {/* Specificații tehnice */}
      <h2>Specificații tehnice</h2>
      <ul className="specs">
        {Object.entries(specs).map(([key, value]) => (
          <li key={key}><strong>{key}:</strong> {value}</li>
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
