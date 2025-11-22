import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./CategoryPage.css";

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fileMap = {
      tractoare: "tractoare.json",
      "recoltatoare-de-porumb": "recoltatoare-de-porumb.json",
      unelte: "unelte.json",
    };

    const fileName = fileMap[categorySlug];
    if (!fileName) return;

    // Setăm titlul categoriei frumos
    const titles = {
      tractoare: "Tractoare",
      "recoltatoare-de-porumb": "Recoltatoare de porumb",
      unelte: "Unelte agricole",
    };
    setCategoryName(titles[categorySlug] || "Produse");

    // Încărcăm produsele
    fetch(`/data/${fileName}`)
      .then((res) => {
        if (!res.ok) throw new Error("Eroare la fetch");
        return res.json();
      })
      .then(setProducts)
      .catch(() => console.warn(`⚠️ Nu s-a putut încărca /data/${fileName}`));
  }, [categorySlug]);

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>{categoryName}</h1>
        <Link to="/produse" className="back-link">
          ← Înapoi la Produsele noastre
        </Link>
      </div>

      <div className="category-grid">
        {products.length > 0 ? (
          products.map((prod, idx) => (
            <div key={idx} className="product-card">
              <img src={prod.image} alt={prod.name} loading="lazy" />
              <h3>{prod.name}</h3>
              <p>{prod.description}</p>
            </div>
          ))
        ) : (
          <p className="no-products">Nu există produse în această categorie.</p>
        )}
      </div>
    </div>
  );
}
