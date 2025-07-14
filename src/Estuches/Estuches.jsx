import React, { useState, useEffect, useMemo } from 'react';
import styles from './Estuches.module.css';
import SearchBar from '../SearchBar';
import ProductCard from '../ProductCard';

const Estuches = () => {
  // Datos memoizados de los estuches
  const estuches = useMemo(() => [
    {
      name: 'Estuche Premium Cuero',
      imageSrc: '/images/estuches/cuero.jpg',
      price: 49.99,
      description: 'Estuche de cuero genuino con forro interior suave',
      details: {
        'Material': 'Cuero genuino',
        'Color': 'Negro, marrón, azul marino',
        'Capacidad': '1 par de lentes',
        'Protección': 'Resistente a golpes',
        'Características': 'Cierre magnético, forro microfibra'
      }
    },
    {
      name: 'Estuche Plegable Viaje',
      imageSrc: '/images/estuches/plegable.jpg',
      price: 29.99,
      description: 'Diseño ultra delgado que se expande para mayor protección',
      details: {
        'Material': 'Nylon resistente',
        'Color': 'Negro, gris, azul',
        'Capacidad': '1-2 pares de lentes',
        'Protección': 'Antigolpes',
        'Características': 'Plegable, ligero (80g)'
      }
    },
    {
      name: 'Estuche Aluminio Elegante',
      imageSrc: '/images/estuches/aluminio.jpg',
      price: 59.99,
      description: 'Carcasa dura de aluminio con bisagra de alta duración',
      details: {
        'Material': 'Aluminio aeronáutico',
        'Color': 'Plateado, dorado, negro mate',
        'Capacidad': '1 par de lentes',
        'Protección': 'A prueba de aplastamiento',
        'Características': 'Forro interior de terciopelo'
      }
    },
    {
      name: 'Estuche Deportivo Resistente',
      imageSrc: '/images/estuches/deportivo.jpg',
      price: 39.99,
      description: 'Diseño resistente al agua y polvo para actividades al aire libre',
      details: {
        'Material': 'Neopreno y plástico',
        'Color': 'Negro, rojo, azul',
        'Capacidad': '1 par de lentes',
        'Protección': 'Resistente al agua',
        'Características': 'Flotante, clip para cinturón'
      }
    },
    {
      name: 'Estuche Vintage Acetato',
      imageSrc: '/images/estuches/vintage.jpg',
      price: 45.99,
      description: 'Estilo retro con patrones clásicos y cierre de latón',
      details: {
        'Material': 'Acetato de alta calidad',
        'Color': 'Tortuga, negro, marrón',
        'Capacidad': '1 par de lentes',
        'Protección': 'Protección básica',
        'Características': 'Diseño exclusivo'
      }
    },
    {
      name: 'Estuche Lujo con Espejo',
      imageSrc: '/images/estuches/espejo.jpg',
      price: 54.99,
      description: 'Estuche de lujo con espejo incorporado y compartimento extra',
      details: {
        'Material': 'Cuero sintético premium',
        'Color': 'Negro, rojo, beige',
        'Capacidad': '1 par + accesorios',
        'Protección': 'Protección media',
        'Características': 'Espejo, bolsillo para paño'
      }
    },
    {
      name: 'Estuche Minimalista Madera',
      imageSrc: '/images/estuches/madera.jpg',
      price: 64.99,
      description: 'Diseño ecológico en madera natural con imanes ocultos',
      details: {
        'Material': 'Madera de bambú',
        'Color': 'Natural, ébano, nogal',
        'Capacidad': '1 par de lentes',
        'Protección': 'Protección ligera',
        'Características': 'Imanes ocultos, ecológico'
      }
    },
    {
      name: 'Estuche Porta Lentes Rígido',
      imageSrc: '/images/estuches/rigido.jpg',
      price: 34.99,
      description: 'Carcasa dura con certificación militar de resistencia',
      details: {
        'Material': 'Policarbonato',
        'Color': 'Negro, azul, gris',
        'Capacidad': '1 par de lentes',
        'Protección': 'A prueba de golpes',
        'Características': 'Estanco, flotante'
      }
    }
  ], []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEstuches, setFilteredEstuches] = useState(estuches);
  const [activeFilter, setActiveFilter] = useState('Todos');

  const categories = ['Todos', 'Cuero', 'Plegable', 'Aluminio', 'Deportivo', 'Vintage', 'Lujo', 'Madera', 'Rígido'];

  useEffect(() => {
    const results = estuches.filter(estuche => {
      const matchesSearch = searchTerm === '' || 
        estuche.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estuche.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.entries(estuche.details).some(
          ([key, value]) => 
            key.toLowerCase().includes(searchTerm.toLowerCase()) || 
            String(value).toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = activeFilter === 'Todos' || 
        estuche.details.Material.includes(activeFilter) ||
        (activeFilter === 'Plegable' && estuche.name.toLowerCase().includes('plegable')) ||
        (activeFilter === 'Deportivo' && estuche.name.toLowerCase().includes('deportivo')) ||
        (activeFilter === 'Vintage' && estuche.name.toLowerCase().includes('vintage')) ||
        (activeFilter === 'Lujo' && estuche.name.toLowerCase().includes('lujo')) ||
        (activeFilter === 'Rígido' && estuche.name.toLowerCase().includes('rígido'));
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredEstuches(results);
  }, [searchTerm, activeFilter, estuches]);

  return (
    <main className={styles.estuchesContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.headerSection}>
          <h1 className={styles.mainTitle}>Colección de Estuches para Lentes</h1>
          <p className={styles.subtitle}>
            Protege tus lentes con estilo con nuestros estuches premium
          </p>
          <SearchBar 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por material, color, características..."
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

        {filteredEstuches.length === 0 ? (
          <p className={styles.noResults}>
            No se encontraron estuches que coincidan con tu búsqueda
          </p>
        ) : (
          <div className={styles.estuchesGrid}>
            {filteredEstuches.map((estuche, index) => (
              <ProductCard
                key={`estuche-${index}`}
                imageSrc={estuche.imageSrc}
                title={estuche.name}
                price={estuche.price}
                description={estuche.description}
                details={estuche.details}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Estuches;