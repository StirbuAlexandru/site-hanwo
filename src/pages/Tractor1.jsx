import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./TractorPage.css";

// Imagini simulate pentru Tractor1
import tractor1_main from "../assets/images/tractoare/Tractor1_main.jpg";
import tractor1_1 from "../assets/images/tractoare/Tractor1_1.jpg";
import tractor1_2 from "../assets/images/tractoare/Tractor1_2.jpg";
import tractor1_3 from "../assets/images/tractoare/Tractor1_3.jpg";
import tractor1_4 from "../assets/images/tractoare/Tractor1_4.jpg";
import tractor1_5 from "../assets/images/tractoare/Tractor1_5.jpg";

// Miniaturi alte tractoare
import tractor2_thumb from "../assets/images/tractoare/Tractor2_main.jpg";
import tractor3_thumb from "../assets/images/tractoare/Tractor3_main.jpg";
import tractor4_thumb from "../assets/images/tractoare/Tractor4_main.jpg";
import tractor5_thumb from "../assets/images/tractoare/Tractor5_main.jpg";
import tractor6_thumb from "../assets/images/tractoare/Tractor6_main.jpg";

export default function Tractor1() {
  const [mainImage, setMainImage] = useState(tractor1_main);

  const images = [tractor1_main, tractor1_1, tractor1_2, tractor1_3, tractor1_4, tractor1_5];

  const otherTractors = [
    { id: 2, name: "Tractor 65 CAI HANWO 604, 4X4, STAGE 5+CARTE RAR INCLUSA", thumb: tractor2_thumb },
    { id: 3, name: "Tractor 75 CAI HANWO 704, 4X4, STAGE 5 + CARTE RAR INCLUSA", thumb: tractor3_thumb },
    { id: 4, name: "Tractor 50 CAI HANWO 504, 4X4, STAGE 5 cu incarcator frontal +CARTE RAR INCLUSA", thumb: tractor4_thumb },
    { id: 5, name: "Tractor HANWO 604, 65 CAI, 4X4, STAGE 5 cu incarcator frontal", thumb: tractor5_thumb },
    { id: 6, name: "Tractor Agricol HANWO 504R – 50 CP, 4×4 euro 5", thumb: tractor6_thumb }
  ];

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

      <h1 className="red-title">Tractor 50 CAI HANWO 504, INMATRICULABIL 4X4 AC</h1>
      <p className="price">Preț de bază: 99,900.00 lei</p>

      {/* Descriere produs */}
      <div className="product-description">
        <p>Tractorul HANWO Model 504 combină forța brută cu eficiența inteligentă, oferind performanțe excelente pentru orice tip de lucrare agricolă. Echipat cu un motor Yunnei DFD20 (Yanmar) de ultimă generație, în conformitate cu standardul Euro V, acest model livrează o putere nominală de 36.8 kW la 2400 rpm, cu un cuplu impresionant de 190 Nm – ideal pentru lucrări grele și terenuri dificile.</p>

        <div className="section-box">🔧 Performanță și eficiență</div>
        <p>Motorul de 2.5 litri turbo oferă un echilibru excelent între putere și consum, iar rezervorul generos de 60 L asigură autonomie ridicată pe durata zilelor de lucru. Tracțiunea integrală (AWD) și ambreiajul uscat, cu dublu stadiu garantează un control precis și o transmisie fiabilă.</p>

        <div className="section-box">⚙️ Transmisie și control</div>
        <p>Cutia de viteze sincronizată 8F+8R permite o selecție optimă pentru fiecare sarcină – de la viteze mici de 1.99 km/h pentru lucrări de precizie, până la 28.37 km/h pentru transport rapid. Sistemul de blocare mecanică a diferențialului și transmisia finală integrală sporesc tracțiunea.</p>

        <div className="section-box">🛠️ Sistem hidraulic de înaltă performanță</div>
        <p>Pompa hidraulică oferă un debit de 36–55 L/min, cu două supape de control și cuplare rapidă. Ridicătorul cu control de poziție și plutitor susține o capacitate de ridicare de 8.3 kN, potrivită pentru o gamă variată de echipamente.</p>

        <div className="section-box">🚦 Siguranță și confort</div>
        <p>Sistemul de frânare umed, pe disc, completat de frâna de parcare mecanică, oferă control maxim și siguranță. Tractorul este echipat cu sistem de protecție la răsturnare și cabină confortabilă cu aer condiționat.</p>

        <div className="section-box">🛞 Configurație și dimensiuni</div>
        <p>Modelul 504 este disponibil cu o gamă variată de anvelope și dimensiuni compacte pentru manevrabilitate optimă.</p>
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
