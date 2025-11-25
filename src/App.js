import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import ScrollTopButton from "./ScrollTopButton";
import Home from "./pages/Home.jsx";
import Produse from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Tractoare from "./pages/Tractoare.jsx";


// Import pagini (înlocuiește cu componentele tale reale)
import Home from "./pages/Home";
import Produse from "./pages/Produse";
import Contact from "./pages/Contact";
import Tractoare from "./pages/Tractoare";

import "./App.css";

function App() {
  return (
    <Router>
      {/* Scroll la începutul paginii la navigare */}
      <ScrollToTop />

      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produse" element={<Produse />} />
          <Route path="/produse/tractoare" element={<Tractoare />} />
          <Route path="/contact" element={<Contact />} />
          {/* poți adăuga alte rute aici */}
        </Routes>

        {/* Buton fix scroll sus */}
        <ScrollTopButton />
      </div>
    </Router>
  );
}

export default App;
