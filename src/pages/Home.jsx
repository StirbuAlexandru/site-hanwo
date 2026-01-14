import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import imagineagrorus from "../assets/images/tractorprincipal.png";
import imagineAbout from "../assets/images/sediu.png";
import { API_URL } from "../config";

import tractor1 from "../assets/images/tractoare/Tractor1_main.jpg";
import tractor2 from "../assets/images/tractoare/Tractor2_main.jpg";
import tractor3 from "../assets/images/tractoare/Tractor3_main.jpg";
import tractor4 from "../assets/images/tractoare/Tractor4_main.jpg";
import tractor5 from "../assets/images/tractoare/Tractor5_main.jpg";
import tractor6 from "../assets/images/tractoare/Tractor6_main.jpg";

export default function Home() {
  const [index, setIndex] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [stats, setStats] = useState({
    experience: 0,
    utilaje: 0,
    parteneri: 0,
    clienti: 0,
  });

  // Dynamic hero image
  const [heroImage, setHeroImage] = useState(imagineagrorus);
  
  // Dynamic promotions from backend
  const [promotiiDinamic, setPromotiiDinamic] = useState([]);
  
  // Dynamic testimonials from backend
  const [testimonials, setTestimonials] = useState([]);
  
  // Dynamic products from backend
  const [products, setProducts] = useState([]);

  const aboutRef = useRef(null);

  // Static fallback images if no products from database
  const defaultImages = [
    { src: tractor1, title: "Tractor 50 CAI HANWO 504, INMATRICULABIL 4X4 AC", link: "/produse/tractoare/1" },
    { src: tractor2, title: "Tractor 65 CAI HANWO 604, 4X4, STAGE 5+CARTE RAR INCLUSA", link: "/produse/tractoare/2" },
    { src: tractor3, title: "Tractor 75 CAI HANWO 704, 4X4, STAGE 5 + CARTE RAR INCLUSA", link: "/produse/tractoare/3" },
    { src: tractor4, title: "Tractor 50 CAI HANWO 504, 4X4, STAGE 5 cu încărcător frontal + CARTE RAR INCLUSA", link: "/produse/tractoare/4" },
    { src: tractor5, title: "Tractor Agricol HANWO 604 – 65 CP, 4×4 Euro 5 + Încărcător Frontal", link: "/produse/tractoare/5" },
    { src: tractor6, title: "Tractor Agricol HANWO 504R – 50 CP, 4×4 Euro 5", link: "/produse/tractoare/6" }
  ];

  // Use dynamic products if available, otherwise use defaults
  const images = products.length > 0
    ? products
        .filter(p => p.category === 'tractoare') // Only tractors
        .map(p => ({
          src: p.main_image || tractor1,
          title: p.name,
          link: `/produse/tractoare/${p.slug}`
        }))
    : defaultImages;

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  // Counter Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2500;
          const start = Date.now();

          const interval = setInterval(() => {
            const progress = Math.min((Date.now() - start) / duration, 1);
            setStats({
              experience: Math.floor(progress * 8),
              utilaje: Math.floor(progress * 300),
              parteneri: Math.floor(progress * 50),
              clienti: Math.floor(progress * 1000),
            });
            if (progress === 1) clearInterval(interval);
          }, 30);
        }
      },
      { threshold: 0.4 }
    );

    if (aboutRef.current) observer.observe(aboutRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  // Recenzii - fallback static testimonials
  const defaultRecenzii = [
    { nume: "Ion Popescu", locatie: "Suceava", text: "Tractorul Hanwo pe care l-am cumpărat anul trecut funcționează impecabil...", rating: 5 },
    { nume: "Maria Tănase", locatie: "Cluj", text: "Am trecut la Hanwo după ce m-am săturat de reparații constante...", rating: 5 },
    { nume: "Vasile Dima", locatie: "Buzău", text: "Folosești un tractor Hanwo o dată și nu mai vrei altceva...", rating: 5 },
    { nume: "Elena Ionescu", locatie: "Iași", text: "Service-ul lor este rapid și profesionist...", rating: 5 },
    { nume: "Mihai Stoica", locatie: "Arad", text: "Sunt foarte mulțumit de modul în care Hanwo a combinat tehnologia...", rating: 5 },
    { nume: "Cristina Pavel", locatie: "Brașov", text: "Pentru noi, investiția în Hanwo a fost cea mai bună decizie...", rating: 5 },
  ];

  // Use dynamic testimonials if available, otherwise use defaults
  const recenzii = testimonials.length > 0
    ? testimonials.map(t => ({
        nume: t.client_name,
        locatie: t.location || "România",
        text: t.content,
        rating: t.rating
      }))
    : defaultRecenzii;

  const [recenzieIndex, setRecenzieIndex] = useState(0);
  const recenziiPerPage = 2;
  const nextRecenzie = () => setRecenzieIndex((prev) => (prev + recenziiPerPage) % recenzii.length);
  const prevRecenzie = () => setRecenzieIndex((prev) => (prev - recenziiPerPage + recenzii.length) % recenzii.length);

  // Promotii carousel - default fallback
  const defaultPromotii = [
    { 
      id: 1,
      src: tractor1, 
      title: "Tractor 50 CAI HANWO, 4X4, STAGE V + Freza agricolă 160cm + Plug agricol cu 2 trupite", 
      price: "99.900,00 lei", 
      link: "/produse/tractoare/1" 
    },
    { 
      id: 5,
      src: tractor5, 
      title: "Tractor 50 CAI HANWO 504, 4X4, STAGE 5 cu încărcător frontal + CARTE RAR INCLUSA", 
      price: "160.000,00 lei", 
      link: "/produse/tractoare/5" 
    }
  ];

  // Use dynamic promotions if available, otherwise use defaults
  const promotii = promotiiDinamic.length > 0 
    ? promotiiDinamic.map(p => ({
        id: p.id,
        src: p.image 
          ? (p.image.startsWith('http') ? p.image : `${API_URL}${p.image}`) 
          : tractor1,
        title: p.name,
        price: p.new_price + " lei",
        oldPrice: p.old_price,
        discount: p.discount,
        link: p.link || `/produse/tractoare`
      }))
    : defaultPromotii;

  const [promoIndex, setPromoIndex] = useState(0);
  const handlePrevPromo = () => {
    setPromoIndex((prev) => (prev - 1 + promotii.length) % promotii.length);
  };

  const handleNextPromo = () => {
    setPromoIndex((prev) => (prev + 1) % promotii.length);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
        handlePrevPromo();
      } else if (e.key === 'ArrowRight') {
        handleNext();
        handleNextPromo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch dynamic data from backend
  useEffect(() => {
    // Fetch hero image
    fetch(`${API_URL}/api/settings/hero`)
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.heroImage) {
          // Check if it's already a full URL (Supabase) or needs API_URL prefix
          const imageUrl = data.heroImage.startsWith('http') 
            ? data.heroImage 
            : `${API_URL}${data.heroImage}`;
          setHeroImage(imageUrl);
        }
      })
      .catch(err => console.log("Using default hero image"));

    // Fetch promotions
    fetch(`${API_URL}/api/promotions`)
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.promotions && data.promotions.length > 0) {
          setPromotiiDinamic(data.promotions);
        }
      })
      .catch(err => console.log("Using default promotions"));

    // Fetch testimonials
    fetch(`${API_URL}/api/testimonials`)
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.testimonials && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        }
      })
      .catch(err => console.log("Using default testimonials"));

    // Fetch products
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(err => console.log("Using default products"));
  }, []);

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <img src={heroImage} alt="Utilaje agricole" className="hero-image" />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">HANWO</h1>
            <p className="hero-subtitle">Putere. Performanță. Agricultură Modernă.</p>
            <Link to="/produse/tractoare" className="hero-button" aria-label="Descoperă produsele noastre">Descoperă</Link>
          </div>
        </div>
      </section>

      {/* CARUSEL PRODUSE */}
 <section className="produse" role="region" aria-label="Produsele noastre">
  <h2 className="section-title">Produsele noastre</h2>

  <div className="carousel-container">
    <button 
      className="carousel-arrow left" 
      onClick={handlePrev} 
      aria-label="Produsul anterior"
    >
      ❮
    </button>

    <div className="carousel-track">
      {/* Show 3 items on desktop, 2 on tablet, 1 on mobile */}
      {(window.innerWidth >= 1024
        ? [images[index], images[(index + 1) % images.length], images[(index + 2) % images.length]]
        : window.innerWidth >= 768
        ? [images[index], images[(index + 1) % images.length]]
        : [images[index]]
      ).map((img, i) => (
        <div key={i} className="carousel-card">
          <Link to={img.link} className="carousel-image-wrapper" tabIndex="-1">
            <img src={img.src} alt={img.title} className="carousel-image" loading="lazy" />
          </Link>
          <h3 className="carousel-title">{img.title}</h3>
        </div>
      ))}
    </div>

    <button 
      className="carousel-arrow right" 
      onClick={handleNext} 
      aria-label="Următorul produs"
    >
      ❯
    </button>
  </div>
</section>

      {/* ABOUT */}
      <section className="about-section" ref={aboutRef} role="region" aria-label="Despre Hanwo">
        <div className="about-container">
          <h2 className="about-title">Despre Hanwo</h2>
          <p className="about-subtitle">Puterea modernă în agricultură românească</p>
          <div className="about-line"></div>
          <p className="about-text">Cu o experiență de peste două decenii, Shandong Hanwo Agricultural Equipment Co., Ltd. este un nume de referință în domeniul echipamentelor agricole inteligente. Compania produce o gamă completă de tractoare, utilaje de recoltare și echipamente pentru furaje, oferind soluții moderne pentru o agricultură eficientă și sustenabilă.</p>
          <div className="about-stats">
            <div className="stat-item"><h3>{stats.experience}+</h3><p>Ani de experiență</p></div>
            <div className="stat-item"><h3>{stats.utilaje}+</h3><p>Utilaje livrate anual</p></div>
            <div className="stat-item"><h3>{stats.parteneri}+</h3><p>Parteneri internaționali</p></div>
            <div className="stat-item"><h3>{stats.clienti}+</h3><p>Clienți mulțumiți</p></div>
          </div>
          <div className="about-image">
            <img src={imagineAbout} alt="Hanwo Agricultură Modernă" loading="lazy" />
          </div>
        </div>
      </section>

      {/* PROMOTII */}
      <section className="promotii" role="region" aria-label="Promoții Hanwo">
        <div className="promotii-header">
          <h2>Promoții Hanwo</h2>
          <p>Oferte speciale pentru echipamentele agricole</p>
        </div>

        {promotiiDinamic.length === 0 ? (
          <div className="no-promotions">
            <div className="no-promotions-icon">🎉</div>
            <h3>Fii la curent cu noile promoții!</h3>
            <p>Momentan nu avem promoții active, dar revino curând pentru oferte speciale.</p>
            <Link to="/produse/tractoare" className="view-products-btn">Vezi Produsele Noastre</Link>
          </div>
        ) : (
          <div className="promotii-container">
            <button 
              className="promotii-arrow left" 
              onClick={handlePrevPromo} 
              aria-label="Promoția anterioară"
            >
              ❮
            </button>

            <div className="promotii-track">
              {(window.innerWidth < 768
                ? [promotii[promoIndex]] // doar un produs pe telefon
                : promotii.length >= 2 
                  ? [promotii[promoIndex], promotii[(promoIndex + 1) % promotii.length]]
                  : [promotii[promoIndex]]
              ).map((promo, i) => (
                <div key={i} className="promotii-card">
                  <Link to={promo.link} className="promotii-image-wrapper" tabIndex="-1">
                    <img src={promo.src} alt={promo.title} className="promotii-image" loading="lazy" />
                    {promo.discount && <span className="discount-badge">-{promo.discount}</span>}
                  </Link>
                  <div className="promotii-content">
                    <h3 className="promotii-title">{promo.title}</h3>
                    <div className="promotii-prices">
                      {promo.oldPrice && <span className="old-price">{promo.oldPrice} lei</span>}
                      <p className="promotii-price">{promo.price}</p>
                    </div>
                    <Link to={promo.link} className="promotii-link">Vezi detalii →</Link>
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="promotii-arrow right" 
              onClick={handleNextPromo} 
              aria-label="Următoarea promoție"
            >
              ❯
            </button>
          </div>
        )}
      </section>

      {/* RECENZII */}
      <section className="recenzii-section" role="region" aria-label="Recenzii clienți">
        <h2 className="recenzii-titlu">CE SPUN CLIENȚII NOȘTRI</h2>
        <div className="recenzii-container">
          <div className="recenzii-stanga">
            <p className="recenzii-descriere">
După mai bine de 20 de ani de dezvoltare, Shandong Hanwo Agricultural Equipment Co., Ltd. a devenit liderul în producția inteligentă de echipamente agricole, oferind fermierilor soluții moderne și durabile pentru agricultură.
            </p>
          </div>
          <div className="recenzii-dreapta">
            <button 
              className="recenzie-arrow left" 
              onClick={prevRecenzie} 
              aria-label="Recenzia anterioară"
            >
              ❮
            </button>
            <div className="recenzii-slider">
              {recenzii.slice(recenzieIndex, recenzieIndex + recenziiPerPage).map((r, i) => (
                <div key={i} className="recenzie-card">
                  <p className="recenzie-text">“{r.text}”</p>
                  <h4>{r.nume}</h4>
                  <span>{r.locatie}</span>
                </div>
              ))}
            </div>
            <button 
              className="recenzie-arrow right" 
              onClick={nextRecenzie} 
              aria-label="Următoarea recenzie"
            >
              ❯
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}