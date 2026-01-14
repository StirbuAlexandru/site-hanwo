import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./TractorPage.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const API_URL = "http://localhost:4000";

export default function DynamicProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [otherProducts, setOtherProducts] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    // Fetch the product
    fetch(`${API_URL}/api/products/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.product) {
          setProduct(data.product);
          setMainImage(data.product.main_image || (data.product.images && data.product.images[0]) || "");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });

    // Fetch other products for sidebar
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.products) {
          setOtherProducts(data.products.filter(p => p.slug !== slug).slice(0, 5));
        }
      })
      .catch(err => console.error("Error fetching other products:", err));
  }, [slug]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "product-page",
          product: product?.name || "Unknown Product"
        }),
      });
      if (res.ok) {
        setFormSent(true);
        setForm({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setFormSent(false), 5000);
      }
    } catch (err) {
      console.error("Eroare la trimitere", err);
    }
  };

  if (loading) {
    return (
      <div className="product-page">
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2>Se încarcă...</h2>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page">
        <Link to="/produse/tractoare" className="back-link">← Înapoi la Tractoare</Link>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2>Produsul nu a fost găsit</h2>
          <p>Verifică URL-ul sau întoarce-te la lista de produse.</p>
        </div>
      </div>
    );
  }

  // Combine main_image with additional images for gallery
  const allImages = [];
  if (product.main_image) allImages.push(product.main_image);
  if (product.images && product.images.length > 0) {
    product.images.forEach(img => {
      if (img && !allImages.includes(img)) allImages.push(img);
    });
  }

  return (
    <div className="product-page">
      <Link to="/produse/tractoare" className="back-link">← Înapoi la Tractoare</Link>

      {/* Product Layout: Image Left, Info Right */}
      <div className="product-layout">
        {/* Left Side: Image Gallery */}
        <div className="product-gallery">
          <div className="main-image">
            <img src={mainImage} alt={product.name} />
          </div>
          
          {/* Galerie thumbnail-uri */}
          {allImages.length > 1 && (
            <div className="thumbnails-horizontal">
              {allImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  onClick={() => setMainImage(img)}
                  className={img === mainImage ? "active-thumb" : ""}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Info */}
        <div className="product-info-right">
          <h1 className="red-title">{product.name}</h1>
          <p className="price">Preț de bază: {product.price} Lei</p>

          {/* Descriere produs */}
          {product.description && (
            <div className="product-description">
              <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
            </div>
          )}
        </div>
      </div>

      {/* Formular Cerere Ofertă */}
      <div className="quote-request-section">
        <h2 className="section-title">Solicită Ofertă</h2>
        
        <div className="quote-container">
          {/* Info Contact Box */}
          <div className="contact-info-box">
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <h4>Locație</h4>
                <p>Str. Principală, nr.151</p>
                <p>Gara Milișăuți, Suceava</p>
              </div>
            </div>

            <div className="info-item">
              <FaClock className="info-icon" />
              <div>
                <h4>Program</h4>
                <p>Luni - Vineri: 09:00 - 18:00</p>
                <p>Sâmbătă: 09:00 - 14:00</p>
              </div>
            </div>

            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div>
                <h4>Email</h4>
                <p>agrorus.brend@gmail.com</p>
              </div>
            </div>

            {/* Butoane Contact */}
            <div className="contact-buttons">
              <a href="tel:+40741220030" className="call-button">
                <FaPhone /> +40 741 220 030
              </a>
              <a href="tel:+40759076654" className="call-button">
                <FaPhone /> +40 759 076 654
              </a>
              <a href="tel:+40755458160" className="call-button">
                <FaPhone /> +40 755 458 160
              </a>
            </div>
          </div>

          {/* Formular */}
          <div className="quote-form-box">
            <form className="quote-form" onSubmit={handleFormSubmit}>
              <h3>Trimite-ne o cerere</h3>
              {formSent && <div className="success-message">Cererea ta a fost trimisă! Te vom contacta în curând.</div>}
              
              <input
                type="text"
                name="name"
                placeholder="Nume complet *"
                value={form.name}
                onChange={handleFormChange}
                required
              />
              
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={form.email}
                onChange={handleFormChange}
                required
              />
              
              <input
                type="tel"
                name="phone"
                placeholder="Telefon *"
                value={form.phone}
                onChange={handleFormChange}
                required
              />
              
              <textarea
                name="message"
                placeholder="Mesajul tău (opțional)"
                value={form.message}
                onChange={handleFormChange}
                rows="4"
              />
              
              <button type="submit" className="submit-button">Trimite Cererea</button>
            </form>
          </div>
        </div>
      </div>

      {/* Alte produse */}
      {otherProducts.length > 0 && (
        <div className="other-tractors-section">
          <h2 className="other-tractors-title">Alte produse</h2>
          <div className="other-tractors">
            {otherProducts.map((p) => (
              <Link to={`/produse/tractoare/${p.slug}`} key={p.id} className="other-tractor-card">
                <img src={p.main_image || '/placeholder.jpg'} alt={p.name} />
                <p>{p.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
