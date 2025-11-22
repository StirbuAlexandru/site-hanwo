export default function ProductCard({ image, title, description }) {
  return (
    <div className="card-product">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
