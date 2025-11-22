import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./TractorPage.css";

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
