import React from 'react';
import styles from './Contacto.module.css';
import { FaWhatsapp, FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';

// Importa tu componente Map (ajusta la ruta según tu estructura de archivos)
import MapComponent from './MapComponent';

const Contacto = () => {
  const phoneNumber = "+584125936487";
  const whatsappLink = `https://wa.me/${phoneNumber.replace(/\D/g, '')}`;
  const address = "C. Cecilio Acosta, Caracas 1060, Miranda";
  const encodedAddress = encodeURIComponent(address);
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  // Coordenadas aproximadas de C. Cecilio Acosta, Caracas
  const location = {
    lat: 10.5000,
    lng: -66.9167,
    zoom: 15
  };

  return (
    <div className={styles.contactoContainer}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Contáctanos</h1>
        <p className={styles.heroSubtitle}>Estamos aquí para ayudarte</p>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.contactInfo}>
          <div className={styles.infoCard}>
            <FaWhatsapp className={styles.icon} />
            <h3>WhatsApp</h3>
            <p>Comunícate directamente con nosotros</p>
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.whatsappButton}
            >
              <FaWhatsapp /> Enviar mensaje
            </a>
          </div>

          <div className={styles.infoCard}>
            <FaMapMarkerAlt className={styles.icon} />
            <h3>Ubicación</h3>
            <p>{address}</p>
            <a
              href={googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapButton}
            >
              <FaMapMarkerAlt /> Ver en Google Maps
            </a>
          </div>

          <div className={styles.infoCard}>
            <FaPhone className={styles.icon} />
            <h3>Teléfono</h3>
            <p>{phoneNumber}</p>
            <a href={`tel:${phoneNumber}`} className={styles.phoneButton}>
              <FaPhone /> Llamar ahora
            </a>
          </div>

          <div className={styles.infoCard}>
            <FaClock className={styles.icon} />
            <h3>Horario</h3>
            <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
            <p>Sábados: 9:00 AM - 2:00 PM</p>
          </div>
        </div>

        <div className={styles.mapContainer}>
          <MapComponent location={location} address={address} />
        </div>
      </div>
    </div>
  );
};

export default Contacto;