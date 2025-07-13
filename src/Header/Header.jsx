import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/eventos" className="nav-link">EVENTOS</Link>
        <Link to="/a-tu-medida" className="nav-link">A TU MEDIDA</Link>
        
        <Link to="/" className="logo-link">
          <img 
            src="/oggio.png"
            alt="Centro Optico" 
            className="logo"
          />
        </Link>
        
        <Link to="/mar-express" className="nav-link">MAR EXPRESS</Link>
        <Link to="/galeria" className="nav-link">GALERÍA</Link>
      </div>
    </header>
  );
};

export default Header;