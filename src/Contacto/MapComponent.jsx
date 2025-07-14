import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importar imágenes de marcador directamente
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Configurar el icono por defecto
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Asignar el icono por defecto globalmente
L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ location, address }) => {
  useEffect(() => {
    // Verificar si el mapa ya está inicializado
    if (document.getElementById('map')?._leaflet_id) return;

    // Inicializar el mapa
    const map = L.map('map').setView([location.lat, location.lng], location.zoom);

    // Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Añadir marcador
    L.marker([location.lat, location.lng])
      .addTo(map)
      .bindPopup(address)
      .openPopup();

    // Limpieza al desmontar el componente
    return () => {
      map.remove();
    };
  }, [location, address]);

  return <div id="map" style={{ width: '100%', height: '100%', minHeight: '400px' }} />;
};

export default MapComponent;