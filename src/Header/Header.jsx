import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 30;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="nav-links-container">
          <Link to="/monturas" className="nav-link">MONTURAS</Link>
          <Link to="/lentescontacto" className="nav-link">LENTES DE CONTACTO</Link>
        </div>
        
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <img 
              src="/oggi.png" 
              alt="Centro Óptico" 
              className="logo"
            />
          </Link>
        </div>
        
        <div className="nav-links-container">
          <Link to="/productos" className="nav-link">PRODUCTOS</Link>
          <Link to="/contacto" className="nav-link">CONTACTO</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;