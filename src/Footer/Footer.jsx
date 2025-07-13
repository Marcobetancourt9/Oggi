import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <h3 className="footer-title">DESCARGA NUESTRA APLICACIÓN</h3>
            <div className="download-app">
              <p className="download-text">Descárgalo en el App Store</p>
              <p className="download-text">DISPONIBLE EN Google Play</p>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">CONTACTO</h3>
            <div className="contact-info">
              <p><span className="contact-label">Correo:</span> ventas@festejosmar.com</p>
              <p><span className="contact-label">Teléfonos:</span></p>
              <p>+58 (212) 953-0022</p>
              <p>+58 (424) 112-9771</p>
              <p><span className="contact-label">Dirección:</span></p>
              <p>Av. Los Cortijos.</p>
              <p>Quinta Esmeralda.</p>
              <p>Url. Campo Alegre. Caracas.</p>
              <p>Venezuela</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            Copyright © {new Date().getFullYear()} Festejos MAR. Desarrollado por Ventana Digital.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;