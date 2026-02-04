import React from 'react';
import './FloatingButtons.css';
import { FaPhone, FaWhatsapp } from 'react-icons/fa';

export default function FloatingButtons() {
  const phoneNumber = '+40741220030';
  const whatsappNumber = '40741220030'; // fără +

  return (
    <div className="floating-buttons">
      <a 
        href={`tel:${phoneNumber}`}
        className="floating-btn phone-btn"
        aria-label="Sună acum"
        title="Sună acum"
      >
        <FaPhone />
      </a>
      <a 
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn whatsapp-btn"
        aria-label="WhatsApp"
        title="WhatsApp"
      >
        <FaWhatsapp />
      </a>
    </div>
  );
}
