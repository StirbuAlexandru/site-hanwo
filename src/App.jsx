import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Tractoare from "./pages/Tractoare";

import Tractor1 from "./pages/Tractor1";
import Tractor2 from "./pages/Tractor2";
import Tractor3 from "./pages/Tractor3";
import Tractor4 from "./pages/Tractor4";
import Tractor5 from "./pages/Tractor5";
import Tractor6 from "./pages/Tractor6";
import Tractor7 from "./pages/Tractor7";

import About from "./pages/About";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <Router>
      <Header />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Lista tractoare */}
        <Route path="/produse/tractoare" element={<Tractoare />} />

        {/* Pagini individuale produse */}
        <Route path="/produse/tractoare/1" element={<Tractor1 />} />
        <Route path="/produse/tractoare/2" element={<Tractor2 />} />
        <Route path="/produse/tractoare/3" element={<Tractor3 />} />
        <Route path="/produse/tractoare/4" element={<Tractor4 />} />
        <Route path="/produse/tractoare/5" element={<Tractor5 />} />
        <Route path="/produse/tractoare/6" element={<Tractor6 />} />
        <Route path="/produse/tractoare/7" element={<Tractor7 />} />

        {/* Alte pagini */}
        <Route path="/despre-noi" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
    </Router>
  );
}
