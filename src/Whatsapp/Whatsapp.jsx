import React from 'react';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  return (
    <div className="whatsapp-button">
      <a 
        href="https://wa.me/+584125936487" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
    </div>
  );
};

export default WhatsAppButton;