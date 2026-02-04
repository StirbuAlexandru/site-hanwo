import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import "./Header.css";
import logo from "../assets/images/hanwologo.png";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`header ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
      <div className="header-container">

        {/* LOGO */}
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="HANWO Logo" />
          </Link>
        </div>

        {/* NAV */}
        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <ul>
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                Acasă
              </NavLink>
            </li>

            <li>
              <NavLink to="/despre-noi" className={({ isActive }) => (isActive ? "active" : "")}>
                Despre noi
              </NavLink>
            </li>

            {/* PRODUSE */}
            <li>
              <NavLink
                to="/produse/tractoare"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Produse
              </NavLink>
            </li>

            <li>
              <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* BURGER MENU */}
        <div className="menu-toggle" onClick={() => setMenuOpen((s) => !s)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

      </div>
    </header>
  );
}
