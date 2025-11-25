import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "./Products.css"; // ← am schimbat aici importul (era Products.css)

// Importăm imaginile din fiecare categorie
import tractor1 from "../assets/images/tractoare/tractor1.jpg";
import tractor2 from "../assets/images/tractoare/tractor2.jpg";
import tractor3 from "../assets/images/tractoare/tractor3.jpg";


export default function Produse() {
  const scrollRefs = {
    tractoare: useRef(null),
    recoltatoare: useRef(null),
    unelte: useRef(null),
  };

  const scroll = (section, direction) => {
    const container = scrollRefs[section].current;
    const scrollAmount = direction === "left" ? -300 : 300;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const data = [
    {
      title: "Tractoare",
      slug: "tractoare",
      products: [
        { img: tractor1, name: "Tractor HANWO T804", price: "45.000 €" },
        { img: tractor2, name: "Tractor HANWO T904", price: "48.000 €" },
        { img: tractor3, name: "Tractor HANWO T1004", price: "52.000 €" },
      ],
    },
    {
      title: "Recoltatoare de porumb",
      slug: "recoltatoare-de-porumb",
        products: [
        { img: recoltatoare1, name: "Combina 4YZ-4A(G4)", price: "15.000 €" },
        { img: recoltatoare2, name: "Combina 4YZ-4B", price: "12.000 €" },
        { img: recoltatoare3, name: "Combina 4YZ-4A(G4) Auto", price: "35.000 €" },
      ],
    },
    {
      title: "Unelte agricole",
      slug: "unelte",
        products: [
        { img: uneala1, name: "Presă de balotat 9YJ-2.2", price: "1.200 €" },
        { img: unealta2, name: "Presă de baloți 9YFQ-2.2", price: "900 €" },
        { img: placeholder, name: "Grapă rotativă 1GQN-180", price: "2.000 €" },
      ],
    },
  ];

  return (
    <div className="products-page">
      <h1>Produsele noastre</h1>

      {data.map((section) => (
        <div key={section.slug} className="category-section">
          <div className="category-header">
            <h2>{section.title}</h2>
          </div>

          <div className="slider-container">
            <div className="products-grid" ref={scrollRefs[section.slug]}>
              {section.products.map((prod, idx) => (
                <div key={idx} className="product-card">
                  <img src={prod.img} alt={prod.name} />
                  <h3>{prod.name}</h3>
                  <p className="price">{prod.price}</p>
                </div>
              ))}

              <Link
                to={`/produse/${section.slug}`}
                className="see-more-card grid-see-more"
              >
                Vezi mai mult →
              </Link>
            </div>

            {/* right scroll button removed — products now flow in grid */}
          </div>
        </div>
      ))}
    </div>
  );
}
