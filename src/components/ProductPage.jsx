import "./ProductPage.css";

export default function ProductPage({ title, image, price, description }) {
  return (
    <div className="product-page">
      <h1>{title}</h1>

      <div className="product-content">
        <img src={image} alt={title} />

        <div className="product-info">
          <p className="product-price">{price}</p>
          <p className="product-description">{description}</p>
        </div>
      </div>
    </div>
  );
}
