import React from 'react';
import './Inicio.css';

const Inicio = () => {
  return (
    <div className="inicio-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-title-line1">¡Ven y,</span>
            <span className="hero-title-line2">Verás!</span>
          </h1>
          <p className="hero-subtitle">Tiendas con <span className="highlight">Cashea</span></p>
        </div>
      </section>

      {/* Buscador de Tiendas */}
      <section className="store-finder">
        <div className="store-finder-container">
          <p className="store-finder-text">Indica tu localidad, ciudad o código postal</p>
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Ej: Caracas, 1010" 
              className="search-input"
            />
            <button className="search-button">Encuentra tu tienda</button>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="product-categories">
        <div className="category-card">
          <div className="category-content">
            <h3 className="category-title">Monturas</h3>
            <button className="category-button">Comprar ahora</button>
          </div>
        </div>

        <div className="category-card">
          <div className="category-content">
            <h3 className="category-title">Lentes de Contacto</h3>
            <button className="category-button">Comprar ahora</button>
          </div>
        </div>

        <div className="category-card">
          <div className="category-content">
            <h3 className="category-title">Lentes de sol</h3>
            <button className="category-button">Comprar ahora</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inicio;