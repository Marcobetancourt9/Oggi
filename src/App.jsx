import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Inicio from './Inicio/Inicio';
import Monturas from './Monturas/Monturas';
import LentesContacto from './LentesContacto/LentesContacto';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Contacto from './Contacto/Contacto';
import Productos from './Productos/Productos';
import Preguntas from './Preguntas/Preguntas';
import Compra from './Compra/Compra';
import Blog from './Blog/Blog';
import LentesSol from './LentesSol/LentesSol';
import Estuches from './Estuches/Estuches';
import Niños from './Niños/Niños';
import Recetados from './Recetados/Recetados';
import Liquido from './Liquido/Liquido';
import './App.css';
import LoginForm from './Login/Login';
import Registro from './Registro/Registro';
import RecuperarContrasena from './RecuperarContrasena/RecuperarContrasena';
import ProductForm from './ProductForm/ProductForm';
import AdminProducts from './AdminProducts/AdminProducts';
import AuthBubble from './Loginbutton/Loginbutton';
import MenuAdmin from './MenuAdmin/MenuAdmin.jsx';
import CombinedBubble from './Whatsapp/CombinedBubble.jsx';

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
            <Route path="/preguntas" element={<Preguntas />} />
            <Route path="/compra" element={<Compra />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/lentessol" element={<LentesSol />} />
            <Route path="/estuches" element={<Estuches />} />
            <Route path="/gafasninos" element={<Niños />} />
            <Route path="/lentesrecetados" element={<Recetados />} />
            <Route path="/liquidolentes" element={<Liquido />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
            <Route path="/product-form" element={<ProductForm />} />            
            <Route path="/borrar" element={<AdminProducts />} />            
            <Route path="/menuadmin" element={<MenuAdmin />} />
          </Routes> 
          </main>
        <Footer />
        <CombinedBubble />
        <AuthBubble />
      </div>
    </Router>
  );
}
