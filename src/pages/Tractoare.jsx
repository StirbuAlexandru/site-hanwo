import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Tractoare.css";

const API_URL = "http://localhost:4000";

export default function Tractoare() {
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products
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

    // Fetch promotions
    fetch(`${API_URL}/api/promotions`)
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.promotions) {
          setPromotions(data.promotions);
        }
      })
      .catch(err => console.error("Error loading promotions:", err));
  }, []);

  // Check if a product has an active promotion
  const getProductPromotion = (productSlug) => {
    return promotions.find(promo => 
      promo.link && promo.link.includes(productSlug)
    );
  };

  return (
    <div className="category-page">
      <h1>Tractoare HANWO</h1>

      {loading ? (
        <div className="loading">Se încarcă produsele...</div>
      ) : (
        <div className="category-grid">
          {products.map((prod) => {
            const promo = getProductPromotion(prod.slug);
            return (
              <Link
                to={`/produse/tractoare/${prod.slug}`}
                key={prod.id}
                className="product-card"
              >
                <div className="product-image-wrapper">
                  <img src={prod.main_image} alt={prod.name} />
                  {promo && promo.discount && (
                    <span className="discount-badge">-{promo.discount}</span>
                  )}
                </div>
                <h3>{prod.name}</h3>
                <div className="price-container">
                  {promo && promo.old_price && (
                    <span className="old-price">{promo.old_price} Lei</span>
                  )}
                  <p className="price">{promo ? promo.new_price : prod.price} Lei</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
