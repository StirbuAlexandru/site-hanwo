import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./TractorPage.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

// Imagini Tractor7
import tractor7_main from "../assets/images/tractoare/Tractor7_main.jpg";
import tractor7_1 from "../assets/images/tractoare/Tractor7_1.jpg";
import tractor7_2 from "../assets/images/tractoare/Tractor7_2.jpg";
import tractor7_3 from "../assets/images/tractoare/Tractor7_3.jpg";
import tractor7_4 from "../assets/images/tractoare/Tractor7_4.jpg";
import tractor7_5 from "../assets/images/tractoare/Tractor7_5.jpg";

// Miniaturi alte tractoare
import tractor1_thumb from "../assets/images/tractoare/Tractor1_main.jpg";
import tractor2_thumb from "../assets/images/tractoare/Tractor2_main.jpg";
import tractor3_thumb from "../assets/images/tractoare/Tractor3_main.jpg";
import tractor4_thumb from "../assets/images/tractoare/Tractor4_main.jpg";
import tractor5_thumb from "../assets/images/tractoare/Tractor5_main.jpg";
import tractor6_thumb from "../assets/images/tractoare/Tractor6_main.jpg";

export default function Tractor7() {
  const [mainImage, setMainImage] = useState(tractor7_main);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  const images = [tractor7_main, tractor7_1, tractor7_2, tractor7_3, tractor7_4, tractor7_5];

  const specs = {
    "Marca motorului": "Yuchai cu 4 cilindri, capacitate 2 litri ETAPA A V-A",
    "Putere nominală": "40 CP",
    "Număr de cilindri": "4 cilindri răciți cu lichid",
    "Capacitatea motorului": "1999 cm³",
    "Transmisie": "Mecanic sincronizat",
    "Echipament": "8*8 cu inversor",
    "Viteză maximă": "28,4 km/h",
    "Tip cuplare hidraulică": "Cuplare în trei puncte categoria II, controlată mecanic",
    "Debit maxim al pompei": "36 L/min",
    "Hidraulică externă": "2 perechi de ieșiri hidraulice",
    "Capacitate maximă de ridicare": "1000 kg",
    "Interval de viteză PTO": "540/1000 rpm",
    "Servodirecție": "Servodirecție hidrostatică cu cilindru cu dublă acțiune și orbitrol",
    "Tracțiune": "4×4, cuplată mecanic",
    "Tip transmisie": "Conic",
    "Sistem de frânare": "Mecanic, umed, independent",
    "Greutate operațională": "2250 kg",
    "Lungime totală": "3810 mm",
    "Înălțime": "2350 mm",
    "Lățime": "1465 mm",
    "Ecartament față": "1200 mm",
    "Ecartament spate": "1200 mm",
    "Gardă la sol": "281 mm",
    "Ambreiaj": "Disc dublu",
    "Anvelope": "Diagonală 7,5/16 * 12,4/24",
    "Blocare diferențial": "Mecanic",
    "Greutăți frontale": "100 kg",
    "Cârlig inferior": "Da",
    "Cârlig superior": "Da",
    "Fotoliu": "Gramatic",
    "Achiziție în rate": "Posibil prin TBI Pay sau UniCredit, condiții minime: salariat minim 3 luni, venit minim 1200 lei; pensionar venit minim 900 lei; vârstă 18–75 ani"
  };

  const otherTractors = [
    { id: 1, name: "Tractor 50 CAI HANWO 504, INMATRICULABIL 4X4 AC", thumb: tractor1_thumb },
    { id: 2, name: "Tractor 65 CAI HANWO 604, 4X4, STAGE 5+CARTE RAR INCLUSA", thumb: tractor2_thumb },
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
          product: "Tractor HANWO 507"
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
        <img src={mainImage} alt="Tractor HANWO 7" />
      </div>

      <div className="thumbnails-horizontal">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Tractor HANWO 7 ${index}`}
            onClick={() => setMainImage(img)}
            className={img === mainImage ? "active-thumb" : ""}
          />
        ))}
      </div>

      <h1 className="red-title">Tractor HANWO 507 – 40 CP, 4×4, Euro 5</h1>
      <p className="price">Preț de bază: 75,000.00 lei</p>

      <div className="product-description">
        <p>Tractor HANWO 507 echipat pentru lucrări agricole eficiente, cu tracțiune 4×4, sistem hidraulic performant și PTO 540/1000.</p>

        <div className="section-box">📦 Informații livrare și rate</div>
        <p>{specs["Achiziție în rate"]}</p>
      </div>

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
