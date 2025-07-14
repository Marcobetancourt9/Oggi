import React, { useState, useEffect, useMemo } from 'react';
import styles from './LentesSol.module.css';
import SearchBar from './SearchBar';
import ProductCard from './ProductCard';

const LentesSol = () => {
  // Datos memoizados de los lentes de sol
  const lentes = useMemo(() => [
    {
      name: 'Aviador Clásico',
      imageSrc: '/images/lentes-sol/aviador.jpg',
      price: 149.99,
      description: 'Diseño icónico con montura metálica y lentes polarizadas',
      details: {
        'Estilo': 'Aviador',
        'Material': 'Metal y cristal polarizado',
        'Protección UV': '100%',
        'Colores disponibles': 'Dorado, plateado, negro',
        'Forma': 'Teardrop'
      }
    },
    {
      name: 'Wayfarer Vintage',
      imageSrc: '/images/lentes-sol/wayfarer.jpg',
      price: 129.99,
      description: 'Estilo retro con montura de acetato y lentes degradadas',
      details: {
        'Estilo': 'Wayfarer',
        'Material': 'Acetato y policarbonato',
        'Protección UV': '100%',
        'Colores disponibles': 'Tortuga, negro, rojo',
        'Forma': 'Rectangular'
      }
    },
    {
      name: 'Deportivos UltraLight',
      imageSrc: '/images/lentes-sol/deportivos.jpg',
      price: 179.99,
      description: 'Lentes ligeros para actividades deportivas con agarre antideslizante',
      details: {
        'Estilo': 'Deportivo',
        'Material': 'TR90 y lentes policarbonato',
        'Protección UV': '100%',
        'Colores disponibles': 'Negro, azul, rojo',
        'Características': 'Polarizados, antirreflejo'
      }
    },
    {
      name: 'Oversized Fashion',
      imageSrc: '/images/lentes-sol/oversized.jpg',
      price: 159.99,
      description: 'Tendencia de moda con lentes grandes y montura fina',
      details: {
        'Estilo': 'Oversized',
        'Material': 'Metal y cristal espejado',
        'Protección UV': '100%',
        'Colores disponibles': 'Oro rosa, plateado, negro',
        'Forma': 'Cuadrada grande'
      }
    },
    {
      name: 'Polarizados Elite',
      imageSrc: '/images/lentes-sol/polarizados.jpg',
      price: 199.99,
      description: 'Tecnología avanzada de lentes polarizados para máxima claridad',
      details: {
        'Estilo': 'Clásico',
        'Material': 'Acetato y lentes polarizados',
        'Protección UV': '100%',
        'Colores lentes': 'Gris, marrón, verde',
        'Beneficios': 'Reduce el resplandor, mejora el contraste'
      }
    },
    {
      name: 'Espejados Retro',
      imageSrc: '/images/lentes-sol/espejados.jpg',
      price: 139.99,
      description: 'Lentes espejados con efecto reflejante en varios colores',
      details: {
        'Estilo': 'Redondo',
        'Material': 'Metal y lentes espejados',
        'Protección UV': '100%',
        'Colores espejo': 'Azul, rosa, plata, dorado',
        'Forma': 'Redonda'
      }
    },
    {
      name: 'Foldable Travel',
      imageSrc: '/images/lentes-sol/plegables.jpg',
      price: 169.99,
      description: 'Diseño plegable para fácil transporte en viajes',
      details: {
        'Estilo': 'Moderno',
        'Material': 'Titanio y policarbonato',
        'Protección UV': '100%',
        'Características': 'Plegables, estuche delgado incluido',
        'Peso': '18g'
      }
    },
    {
      name: 'Cat Eye Elegance',
      imageSrc: '/images/lentes-sol/cateye.jpg',
      price: 149.99,
      description: 'Estilo femenino con forma de cat eye y detalles dorados',
      details: {
        'Estilo': 'Cat Eye',
        'Material': 'Acetato y metal',
        'Protección UV': '100%',
        'Colores disponibles': 'Tortuga, negro, blanco',
        'Forma': 'Almendrada con punta'
      }
    }
  ], []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLentes, setFilteredLentes] = useState(lentes);
  const [activeFilter, setActiveFilter] = useState('Todos');

  const categories = ['Todos', 'Aviador', 'Wayfarer', 'Deportivo', 'Oversized', 'Polarizados', 'Espejados', 'Plegables', 'Cat Eye'];

  useEffect(() => {
    const results = lentes.filter(lente => {
      const matchesSearch = searchTerm === '' || 
        lente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lente.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.entries(lente.details).some(
          ([key, value]) => 
            key.toLowerCase().includes(searchTerm.toLowerCase()) || 
            String(value).toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = activeFilter === 'Todos' || 
        lente.details.Estilo === activeFilter ||
        (activeFilter === 'Polarizados' && lente.description.toLowerCase().includes('polariz')) ||
        (activeFilter === 'Espejados' && lente.description.toLowerCase().includes('espej')) ||
        (activeFilter === 'Plegables' && lente.description.toLowerCase().includes('pleg'));
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredLentes(results);
  }, [searchTerm, activeFilter, lentes]);

  return (
    <main className={styles.lentesContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.headerSection}>
          <h1 className={styles.mainTitle}>Colección de Lentes de Sol</h1>
          <p className={styles.subtitle}>
            Protege tus ojos con estilo y encuentra el par perfecto para cada ocasión
          </p>
          <SearchBar 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por estilo, material, color..."
          />
        </header>

        {/* Menú de categorías */}
        <div className={styles.menuCategories}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryButton} ${activeFilter === category ? styles.active : ''}`}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredLentes.length === 0 ? (
          <p className={styles.noResults}>
            No se encontraron lentes que coincidan con tu búsqueda
          </p>
        ) : (
          <div className={styles.lentesGrid}>
            {filteredLentes.map((lente) => (
              <ProductCard
                key={lente.id}
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

export default LentesSol;