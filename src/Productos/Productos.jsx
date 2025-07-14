import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './Productos.module.css';

// Importación optimizada de imágenes
const importImages = {
  lentesSol: new URL('../images/lentes-sol.jpg', import.meta.url).href,
  lentesRecetados: new URL('../images/lentes-recetados.jpg', import.meta.url).href,
  gafasNinos: new URL('../images/gafas-ninos.jpg', import.meta.url).href,
  lentesContacto: new URL('../images/lentes-contacto.jpg', import.meta.url).href,
  estuches: new URL('../images/estuches.jpg', import.meta.url).href,
  liquidoLentes: new URL('../images/liquido-lentes.jpg', import.meta.url).href,
};

const productos = [
  {
    id: 1,
    nombre: 'Lentes de Sol',
    descripcion: 'Protección UV con estilo moderno.',
    imagen: importImages.lentesSol,
    ruta: '/lentessol'
  },
  {
    id: 2,
    nombre: 'Lentes Recetados',
    descripcion: 'Personalizados según tu fórmula.',
    imagen: importImages.lentesRecetados,
    ruta: '/lentesrecetados'
  },
  {
    id: 3,
    nombre: 'Gafas para Niños',
    descripcion: 'Resistentes y seguras para los más pequeños.',
    imagen: importImages.gafasNinos,
    ruta: '/gafasninos'
  },
  {
    id: 4,
    nombre: 'Lentes de Contacto',
    descripcion: 'Cómodos y fáciles de usar a diario.',
    imagen: importImages.lentesContacto,
    ruta: '/lentescontacto'
  },
  {
    id: 5,
    nombre: 'Estuches para Lentes',
    descripcion: 'Protege tus gafas con estilo.',
    imagen: importImages.estuches,
    ruta: '/estuches'
  },
  {
    id: 6,
    nombre: 'Líquido para Lentes',
    descripcion: 'Solución limpiadora y desinfectante.',
    imagen: importImages.liquidoLentes,
    ruta: '/liquidolentes'
  },
];

const ProductoCard = ({ producto, onVerMasClick }) => (
  <motion.div 
    className={styles.card}
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    aria-label={`Producto: ${producto.nombre}`}
  >
    <img 
      src={producto.imagen} 
      alt={producto.descripcion}
      className={styles.imagen}
      loading="lazy"
      width={300}
      height={200}
    />
    <div className={styles.overlay}>
      <h3>{producto.nombre}</h3>
      <p>{producto.descripcion}</p>
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={styles.boton}
        aria-label={`Ver detalles de ${producto.nombre}`}
        onClick={() => onVerMasClick(producto.ruta)}
      >
        Ver más
      </motion.button>
    </div>
  </motion.div>
);

const Productos = () => {
  const navigate = useNavigate();

  const handleVerMasClick = (ruta) => {
    navigate(ruta);
  };

  return (
    <section className={styles.productosSection} id="productos">
      <motion.h2 
        className={styles.titulo}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Nuestros Productos
      </motion.h2>

      <div className={styles.grid}>
        {productos.map((producto) => (
          <ProductoCard 
            key={`producto-${producto.id}`}
            producto={producto}
            onVerMasClick={handleVerMasClick}
          />
        ))}
      </div>
    </section>
  );
};

export default Productos;