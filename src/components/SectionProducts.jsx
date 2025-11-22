import ProductCard from "./ProductCard";
import products from "../utils/data";  // un fișier cu date mock

export default function SectionProducts() {
  return (
    <section className="products-section">
      <h2>Produsele noastre</h2>
      <div className="products-grid">
        {products.map((prod) => (
          <ProductCard
            key={prod.id}
            image={prod.image}
            title={prod.title}
            description={prod.description}
          />
        ))}
      </div>
    </section>
  );
}
