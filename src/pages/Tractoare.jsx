import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Tractoare.css";

const API_URL = import.meta.env.PROD ? "https://hanwo-backend.onrender.com" : "http://localhost:4000";

export default function Tractoare() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.products) {
          setProducts(data.products.filter(p => p.category === 'tractoare'));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="category-page">
      <h1>Tractoare HANWO</h1>

      {loading ? (
        <div className="loading">Se încarcă produsele...</div>
      ) : (
        <div className="category-grid">
          {products.map((prod) => (
            <Link
              to={`/produse/tractoare/${prod.slug}`}
              key={prod.id}
              className="product-card"
            >
              <img src={prod.main_image} alt={prod.name} />
              <h3>{prod.name}</h3>
              <p className="price">{prod.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
