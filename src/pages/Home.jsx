import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import imagineagrorus from "../assets/images/tractoracasa.jpg";
import imagineAbout from "../assets/images/sediu.png";

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

  const aboutRef = useRef(null);

  const images = [
    { src: tractor1, title: "Tractor 50 CAI HANWO 504, INMATRICULABIL 4X4 AC", link: "/produse/tractoare/1" },
    { src: tractor2, title: "Tractor 65 CAI HANWO 604, 4X4, STAGE 5+CARTE RAR INCLUSA", link: "/produse/tractoare/2" },
    { src: tractor3, title: "Tractor 75 CAI HANWO 704, 4X4, STAGE 5 + CARTE RAR INCLUSA", link: "/produse/tractoare/3" },
    { src: tractor4, title: "Tractor 50 CAI HANWO 504, 4X4, STAGE 5 cu încărcător frontal + CARTE RAR INCLUSA", link: "/produse/tractoare/4" },
    { src: tractor5, title: "Tractor Agricol HANWO 604 – 65 CP, 4×4 Euro 5 + Încărcător Frontal", link: "/produse/tractoare/5" },
    { src: tractor6, title: "Tractor Agricol HANWO 504R – 50 CP, 4×4 Euro 5", link: "/produse/tractoare/6" }
  ];

  const handlePrev = () => {
    setIndex((prev) => (prev - 2 + images.length) % images.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 2) % images.length);
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
              experience: Math.floor(progress * 15),
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

  // Evenimente slider
  const evenimente = [
    { src: "/pages/eveniment1.jpg", title: "Hanwo la târgul Agraria 2024" },
    { src: "/pages/eveniment2.jpg", title: "Prezentare utilaje Hanwo în Bacău" },
    { src: "/pages/eveniment3.jpg", title: "Lansare nouă gamă de tractoare Hanwo" },
  ];

  const [slide, setSlide] = useState(0);
  const nextSlide = () => setSlide((prev) => (prev + 1) % evenimente.length);
  const prevSlide = () => setSlide((prev) => (prev - 1 + evenimente.length) % evenimente.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  // Recenzii
  const recenzii = [
    { nume: "Ion Popescu", locatie: "Suceava", text: "Tractorul Hanwo pe care l-am cumpărat anul trecut funcționează impecabil..." },
    { nume: "Maria Tănase", locatie: "Cluj", text: "Am trecut la Hanwo după ce m-am săturat de reparații constante..." },
    { nume: "Vasile Dima", locatie: "Buzău", text: "Folosești un tractor Hanwo o dată și nu mai vrei altceva..." },
    { nume: "Elena Ionescu", locatie: "Iași", text: "Service-ul lor este rapid și profesionist..." },
    { nume: "Mihai Stoica", locatie: "Arad", text: "Sunt foarte mulțumit de modul în care Hanwo a combinat tehnologia..." },
    { nume: "Cristina Pavel", locatie: "Brașov", text: "Pentru noi, investiția în Hanwo a fost cea mai bună decizie..." },
  ];

  const [recenzieIndex, setRecenzieIndex] = useState(0);
  const recenziiPerPage = 2;
  const nextRecenzie = () => setRecenzieIndex((prev) => (prev + recenziiPerPage) % recenzii.length);
  const prevRecenzie = () => setRecenzieIndex((prev) => (prev - recenziiPerPage + recenzii.length) % recenzii.length);

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <img src={imagineagrorus} alt="Utilaje agricole" className="hero-image" />
        <div className="hero-overlay">
          <Link to="/produse/tractoare" className="hero-button">Descoperă</Link>
        </div>
      </section>

      {/* CARUSEL PRODUSE */}
    <section className="produse">
  <h2 className="section-title">Produsele noastre</h2>

  <div className="carousel-container">
    <button className="carousel-arrow left" onClick={handlePrev}>❮</button>

    <div className="carousel-track">
      {[images[index], images[(index + 1) % images.length]].map((img, i) => (
        <div key={i} className="carousel-card">
          <Link to={img.link} className="carousel-image-wrapper">
            <img src={img.src} alt={img.title} className="carousel-image" />
          </Link>

          <h3 className="carousel-title">{img.title}</h3>

        </div>
      ))}
    </div>

    <button className="carousel-arrow right" onClick={handleNext}>❯</button>
  </div>
</section>


      {/* ABOUT */}
      <section className="about-section" ref={aboutRef}>
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
            <img src={imagineAbout} alt="Hanwo Agricultură Modernă" />
          </div>
        </div>
      </section>

      {/* EVENIMENTE */}
      <section className="evenimente">
        <div className="evenimente-header">
          <h2>Evenimente Hanwo</h2>
          <p>Momente de la târguri și prezentări din toată țara</p>
        </div>
        <div className="evenimente-slider">
          <button className="evenimente-arrow left" onClick={prevSlide}>❮</button>
          <div className="evenimente-wrapper" style={{ transform: `translateX(-${slide * 100}%)` }}>
            {evenimente.map((ev, i) => (
              <div key={i} className="eveniment-item"><img src={ev.src} alt={ev.title} /></div>
            ))}
          </div>
          <button className="evenimente-arrow right" onClick={nextSlide}>❯</button>
        </div>
      </section>

      {/* RECENZII */}
      <section className="recenzii-section">
        <h2 className="recenzii-titlu">CE SPUN CLIENȚII NOȘTRI</h2>
        <div className="recenzii-container">
          <div className="recenzii-stanga">
            <p className="recenzii-descriere">
După mai bine de 20 de ani de dezvoltare, Shandong Hanwo Agricultural Equipment Co., Ltd. a devenit liderul în producția inteligentă de echipamente agricole, oferind fermierilor soluții moderne și durabile pentru agricultură.
            </p>
          </div>
          <div className="recenzii-dreapta">
            <button className="recenzie-arrow left" onClick={prevRecenzie}>❮</button>
            <div className="recenzii-slider">
              {recenzii.slice(recenzieIndex, recenzieIndex + recenziiPerPage).map((r, i) => (
                <div key={i} className="recenzie-card">
                  <p className="recenzie-text">“{r.text}”</p>
                  <h4>{r.nume}</h4>
                  <span>{r.locatie}</span>
                </div>
              ))}
            </div>
            <button className="recenzie-arrow right" onClick={nextRecenzie}>❯</button>
          </div>
        </div>
      </section>
    </div>
  );
}
