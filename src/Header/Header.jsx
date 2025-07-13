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
          <Link to="/eventos" className="nav-link">EVENTOS</Link>
          <Link to="/a-tu-medida" className="nav-link">A TU MEDIDA</Link>
        </div>
        
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <img 
              src="/oggio.png" 
              alt="Centro Óptico" 
              className="logo"
            />
          </Link>
        </div>
        
        <div className="nav-links-container">
          <Link to="/mar-express" className="nav-link">MAR EXPRESS</Link>
          <Link to="/galeria" className="nav-link">GALERÍA</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;