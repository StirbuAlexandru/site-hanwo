import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./TractorPage.css";

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
import tractor4_thumb from "../assets/images/tractoare/tractor4_main.jpg";
import tractor5_thumb from "../assets/images/tractoare/tractor5_main.jpg";
import tractor6_thumb from "../assets/images/tractoare/tractor6_main.jpg";

export default function Tractor3() {
  const [mainImage, setMainImage] = useState(tractor3_main);

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
