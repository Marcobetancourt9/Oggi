import React from 'react';
import './Inicio.css';

// Importa tus imágenes (asegúrate de tener estas imágenes en tu proyecto)
import monturasImg from '../images/monturas.jpg';
import lentesContactoImg from '../images/lentes-contacto.jpg';
import lentesSolImg from '../images/lentes-sol.png';

const Inicio = () => {
  return (
    <div className="inicio-container">
      {/* Hero Section con efecto parallax */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-title-line1">¡Oggi tu centro óptico ideal!</span>
          </h1>
          <p className="hero-subtitle">Tiendas con <span className="highlight">Cashea</span></p>
          <button className="hero-button">Descubre más</button>
        </div>
      </section>

      {/* Product Categories con imágenes */}
      <section className="product-categories">
        <h2 className="section-title">Nuestros Productos</h2>
        <p className="section-subtitle">Calidad y estilo para tu visión</p>
        
        <div className="categories-grid">
          <div className="category-card">
            <div className="category-image" style={{ backgroundImage: `url(${monturasImg})` }}></div>
            <div className="category-content">
              <h3 className="category-title">Monturas</h3>
              <p className="category-description">Las últimas tendencias en monturas para todos los estilos</p>
              <button className="category-button">Comprar ahora</button>
            </div>
          </div>

          <div className="category-card">
            <div className="category-image" style={{ backgroundImage: `url(${lentesContactoImg})` }}></div>
            <div className="category-content">
              <h3 className="category-title">Lentes de Contacto</h3>
              <p className="category-description">Comodidad y claridad para tus ojos</p>
              <button className="category-button">Comprar ahora</button>
            </div>
          </div>

          <div className="category-card">
            <div className="category-image" style={{ backgroundImage: `url(${lentesSolImg})` }}></div>
            <div className="category-content">
              <h3 className="category-title">Lentes de sol</h3>
              <p className="category-description">Protección UV con estilo</p>
              <button className="category-button">Comprar ahora</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inicio;