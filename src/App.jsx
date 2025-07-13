import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import Inicio from './inicio/Inicio.jsx';
import Header from './Header/Header.jsx';
import SocialLinks from './SocialLinks/SocialLinks.jsx';
import Menu from "./Menu/Menu.jsx";
import './App.css'; // Archivo CSS global

export default function App() {
  return (
    <div className="global-app-container">
      <Router>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/menu" element={<Menu />} />
          </Routes>
        </main>
        <SocialLinks />
      </Router>
    </div>
  );
}
