import React from "react";
import { Link } from "react-router-dom";
import "./Tractoare.css";

import tractor1 from "../assets/images/tractoare/Tractor1_main.jpg";
import tractor2 from "../assets/images/tractoare/Tractor2_main.jpg";
import tractor3 from "../assets/images/tractoare/Tractor3_main.jpg";
import tractor4 from "../assets/images/tractoare/Tractor4_main.jpg";
import tractor5 from "../assets/images/tractoare/Tractor5_main.jpg";
import tractor6 from "../assets/images/tractoare/Tractor6_main.jpg";
import tractor7 from "../assets/images/tractoare/Tractor7_main.jpg"; // adăugat

export default function Tractoare() {
  const produse = [
    { id: 1, name: "Tractor 50 CAI HANWO 504, INMATRICULABIL 4X4 AC", price: "99,900.00 lei", image: tractor1 },
    { id: 2, name: "Tractor 65 CAI HANWO 604, 4X4, STAGE 5+CARTE RAR INCLUSA", price: "135,000.00 lei", image: tractor2 },
    { id: 3, name: "Tractor 75 CAI HANWO 704, 4X4, STAGE 5 + CARTE RAR INCLUSA", price: "140,000.00 lei", image: tractor3 },
    { id: 4, name: "Tractor 50 CAI HANWO 504, 4X4, STAGE 5 cu incarcator forntal +CARTE RAR INCLUSA", price: "138,000.00 lei", image: tractor4 },
    { id: 5, name: "Tractor HANWO 604, 65 CAI, 4X4, STAGE 5 cu incarcator frontal", price: "160,000.00 lei", image: tractor5 },
    { id: 6, name: "Tractor Agricol HANWO 504R – 50 CP, 4×4 euro 5", price: "90,000.00 lei", image: tractor6 },
    { id: 7, name: "Tractor Agricol HANWO 354R – 40 CP, 4×4 Inmatriculabil", price: "90,000.00 lei", image: tractor7 }, // adăugat
  ];

  return (
    <div className="category-page">
      <h1>Tractoare HANWO</h1>

      <div className="category-grid">
        {produse.map((prod) => (
          <Link
            to={`/produse/tractoare/${prod.id}`}
            key={prod.id}
            className="product-card"
          >
            <img src={prod.image} alt={prod.name} />
            <h3>{prod.name}</h3>
            <p className="price">{prod.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
