import React, { useEffect, useState } from 'react';
import './WhatsAppButton.css';
import { useNavigate } from 'react-router-dom';

const WhatsAppButton = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  const navigate = useNavigate();

  // Lista de correos de administrador (reemplaza con tus correos reales)
  const adminEmails = [
    'admin@empresa.com', 
    'supervisor@empresa.com', 
    'marco.betancourt@correo.unimet.edu.ve'
  ];

  useEffect(() => {
    // Simulamos la detección del usuario (en una app real, esto vendría de tu sistema de autenticación)
    const userEmail = localStorage.getItem('userEmail') || 'marco.betancourt@correo.unimet.edu.ve';
    
    if (adminEmails.includes(userEmail)) {
      setIsAdmin(true);
    }

    // Efecto de pulso intermitente cada 3 segundos
    const pulseInterval = setInterval(() => {
      setIsPulsing(prev => !prev);
    }, 3000);

    return () => clearInterval(pulseInterval);
  }, []);

  const handleClick = () => {
    if (isAdmin) {
      navigate('/menuadmin');
    } else {
      window.open('https://wa.me/+584125936487', '_blank');
    }
  };

  return (
    <div className={`whatsapp-button ${isPulsing ? 'pulse' : ''}`}>
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        aria-label={isAdmin ? "Acceder al panel de administración" : "Contactar por WhatsApp"}
        className={isAdmin ? 'admin-button' : ''}
      >
        {isAdmin ? (
          <>
            <i className="fas fa-user-shield"></i>
            {isHovering && <span className="tooltip">Panel Admin</span>}
          </>
        ) : (
          <>
            <i className="fab fa-whatsapp"></i>
            {isHovering && <span className="tooltip">WhatsApp</span>}
          </>
        )}
      </button>
    </div>
  );
};

export default WhatsAppButton;