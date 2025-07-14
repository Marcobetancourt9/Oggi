import React, { useState, useEffect, useMemo } from 'react';
import styles from './LentesContacto.module.css';
import SearchBar from '../SearchBar';
import ProductCard from '../ProductCard';

const LentesContacto = () => {
  // Datos memoizados de los lentes de contacto
  const lentes = useMemo(() => [
    {
      name: 'Lentes Diarios ComfortPlus',
      imageSrc: '/images/lentes/diarios-comfort.jpg',
      price: 59.99,
      description: 'Lentes desechables diarios con máxima oxigenación',
      details: {
        Tipo: 'Desechable diario',
        Material: 'Hidrogel de silicona',
        'Duración': '30 lentes (15 pares)',
        'Uso recomendado': '8-12 horas diarias'
      }
    },
    {
      name: 'Lentes Mensuales OxygenMax',
      imageSrc: '/images/lentes/mensuales-oxygen.jpg',
      price: 89.99,
      description: 'Alta transmisión de oxígeno para uso prolongado',
      details: {
        Tipo: 'Desechable mensual',
        Material: 'Hidrogel de silicona',
        'Duración': '1 par (30 días)',
        'Uso recomendado': 'Hasta 14 horas diarias'
      }
    },
    {
      name: 'Lentes Tóricos Precision',
      imageSrc: '/images/lentes/toricos-precision.jpg',
      price: 109.99,
      description: 'Corrección precisa para astigmatismo',
      details: {
        Tipo: 'Desechable mensual',
        Material: 'Hidrogel de silicona',
        'Duración': '1 par (30 días)',
        'Uso recomendado': 'Hasta 12 horas diarias',
        'Especial': 'Para astigmatismo'
      }
    },
    {
      name: 'Lentes Multifocales VistaClear',
      imageSrc: '/images/lentes/multifocales-vista.jpg',
      price: 129.99,
      description: 'Solución para presbicia con transición suave',
      details: {
        Tipo: 'Desechable mensual',
        Material: 'Hidrogel de silicona',
        'Duración': '1 par (30 días)',
        'Uso recomendado': 'Hasta 12 horas diarias',
        'Especial': 'Multifocal'
      }
    },
    {
      name: 'Lentes de Color NaturalLook',
      imageSrc: '/images/lentes/color-natural.jpg',
      price: 79.99,
      description: 'Realza el color natural de tus ojos',
      details: {
        Tipo: 'Desechable mensual',
        Material: 'Hidrogel',
        'Duración': '1 par (30 días)',
        'Uso recomendado': '6-8 horas diarias',
        'Colores': 'Azul, verde, avellana, gris'
      }
    },
    {
      name: 'Lentes para Ojos Secos Moisture+',
      imageSrc: '/images/lentes/ojos-secos.jpg',
      price: 99.99,
      description: 'Hidratación prolongada para mayor comodidad',
      details: {
        Tipo: 'Desechable mensual',
        Material: 'Hidrogel con humectantes',
        'Duración': '1 par (30 días)',
        'Uso recomendado': 'Hasta 16 horas diarias',
        'Especial': 'Para ojos secos'
      }
    },
    {
      name: 'Lentes Nocturnas OrthoK',
      imageSrc: '/images/lentes/nocturnas-ortho.jpg',
      price: 199.99,
      description: 'Moldean la córnea mientras duermes',
      details: {
        Tipo: 'Anuales',
        Material: 'Gas permeable',
        'Duración': '1 par (12-24 meses)',
        'Uso recomendado': 'Usar de noche, visión clara de día'
      }
    },
    {
      name: 'Lentes Deportivas ActiveFit',
      imageSrc: '/images/lentes/deportivas-active.jpg',
      price: 89.99,
      description: 'Estables durante actividad física intensa',
      details: {
        Tipo: 'Desechable mensual',
        Material: 'Hidrogel de silicona',
        'Duración': '1 par (30 días)',
        'Uso recomendado': 'Deportes y actividades físicas',
        'Especial': 'Diseño estabilizado'
      }
    }
  ], []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLentes, setFilteredLentes] = useState(lentes);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLentes(lentes);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = lentes.filter(
        (lente) =>
          lente.name.toLowerCase().includes(term) ||
          lente.description.toLowerCase().includes(term) ||
          Object.entries(lente.details).some(
            ([key, value]) => 
              key.toLowerCase().includes(term) || 
              String(value).toLowerCase().includes(term)
          )
      );
      setFilteredLentes(filtered);
    }
  }, [searchTerm, lentes]);

  return (
    <main className={styles.lentesContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.headerSection}>
          <h1 className={styles.mainTitle}>
            Catálogo de Lentes de Contacto
          </h1>
          <p className={styles.subtitle}>
            Encuentra los lentes perfectos para tu visión y estilo de vida
          </p>
          <SearchBar 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por tipo, material, uso especial..."
          />
        </header>

        {filteredLentes.length === 0 ? (
          <p className={styles.noResults}>
            No se encontraron lentes que coincidan con tu búsqueda
          </p>
        ) : (
          <div className={styles.lentesGrid}>
            {filteredLentes.map((lente, index) => (
              <ProductCard
                key={`${lente.name}-${index}`}
                imageSrc={lente.imageSrc}
                title={lente.name}
                price={lente.price}
                description={lente.description}
                details={lente.details}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default LentesContacto;