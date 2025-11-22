import React from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetails.css";
import data from "../data/products.json";

export default function ProductDetails() {
  const { slug } = useParams();

  // Cautăm produsul în toate categoriile
  const product = data.categories
    .flatMap((c) => c.products)
    .find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Produsul nu a fost găsit</h2>
        <Link to="/produse" className="back-btn">
          ← Înapoi la produse
        </Link>
      </div>
    );
  }

  return (
    <div className="product-details">
      <div className="product-details-container">
        {/* Imaginea în stânga */}
        <div className="product-details-image">
          <img src={product.image} alt={product.name} />
        </div>

        {/* Textul în dreapta */}
        <div className="product-details-info">
          <h1>{product.name}</h1>
          <p className="price">Preț: {product.price} EUR</p>
          <p className="description">{product.description}</p>

          <Link to="/produse" className="back-btn">
            ← Înapoi la produse
          </Link>
        </div>
      </div>
    </div>
  );
}
