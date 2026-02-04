// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import FloatingButtons from "./components/FloatingButtons";

import Home from "./pages/Home";
import Tractoare from "./pages/Tractoare";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import DynamicProductPage from "./pages/DynamicProductPage";

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname === "/admin";

  return (
    <>
      <ScrollToTop />
      {!isDashboard && <Header />}

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Lista tractoare */}
        <Route path="/produse/tractoare" element={<Tractoare />} />

        {/* Produse dinamice din baza de date */}
        <Route path="/produse/tractoare/:slug" element={<DynamicProductPage />} />

        {/* Alte pagini */}
        <Route path="/despre-noi" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Dashboard Admin */}
        <Route path="/admin" element={<Dashboard />} />
      </Routes>

      {!isDashboard && <Footer />}
      {!isDashboard && <FloatingButtons />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
