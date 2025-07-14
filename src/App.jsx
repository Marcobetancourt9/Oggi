import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Inicio from './Inicio/Inicio';
import Monturas from './Monturas/Monturas';
import LentesContacto from './LentesContacto/LentesContacto';
import '@fortawesome/fontawesome-free/css/all.min.css';
import WhatsApp from './Whatsapp/Whatsapp';
import Contacto from './Contacto/Contacto';
import Productos from './Productos/Productos';
//import Menu from './Menu/Menu';
import './App.css';

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <Router>
      <div className="app-container">
        <Header className={scrolled ? 'scrolled' : ''} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/monturas" element={<Monturas />} />
            <Route path="/lentescontacto" element={<LentesContacto />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/productos" element={<Productos />} />
          </Routes> 
          </main>
        <Footer />
        <WhatsApp />
      </div>
    </Router>
  );
}
