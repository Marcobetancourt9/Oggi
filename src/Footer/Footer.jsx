import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <h3 className="footer-title">Servicios</h3>
            <ul className="footer-links">
              <li><a href="/financiamiento">Sistema de Financiamiento</a></li>
              <li><a href="/apartado">Sistema De Apartado</a></li>
              <li><a href="/devoluciones">Política de Devolución</a></li>
              <li><a href="/reparacion">Reparación</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Atención al cliente</h3>
            <ul className="footer-links">
              <li><a href="/faq">Preguntas Frecuentes</a></li>
              <li><a href="/envios">Envío</a></li>
              <li><a href="/trabaja-con-nosotros">Trabaja con Nosotros</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Sobre</h3>
            <ul className="footer-links">
              <li><a href="/nosotros">Sobre Nosotros</a></li>
              <li><a href="/vision">Visión De Vida</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Servicios Clave</h3>
            <ul className="footer-links">
              <li><a href="/examen-vista">Examen de la Vista</a></li>
              <li><a href="/garantia">Garantía Extendida</a></li>
              <li><a href="/servicio-expresa">Servicio Expresa</a></li>
              <li><a href="/corporativos">Servicios Corporativos</a></li>
            </ul>
          </div>
        </div>

        <div className="payment-methods">
          <h4>Métodos de pago:</h4>
          <div className="payment-icons">
            <span>Safetoy</span>
            <span>Página</span>
            <span>Nombre</span>
            <span>Término</span>
          </div>
        </div>

        <div className="social-media">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.instagram.com/centroopticooggi/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
        </div>

        <div className="copyright">
          <p>© Óptica Caroni. Todos los derechos reservados. Sitio web por: <a href="https://www.opticommerce.com" target="_blank" rel="noopener noreferrer">OptiCommerce</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;