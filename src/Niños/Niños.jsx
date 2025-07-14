import React, { useState, useEffect, useMemo } from 'react';
import styles from './Ninos.module.css';
import SearchBar from '../SearchBar';
import ProductCard from '../ProductCard';

const Ninos = () => {
  // Datos memoizados de lentes para niños
  const lentesNinos = useMemo(() => [
    {
      name: 'Explorer Junior',
      imageSrc: '/images/ninos/explorer.jpg',
      price: 89.99,
      description: 'Lentes resistentes para pequeños aventureros',
      details: {
        'Edad recomendada': '3-8 años',
        'Material': 'TR90 irrompible',
        'Protección UV': '100%',
        'Colores': 'Azul, rosa, verde, negro',
        'Características': 'Patillas flexibles, puente ajustable'
      }
    },
    {
      name: 'Princesa Brillante',
      imageSrc: '/images/ninos/princesa.jpg',
      price: 79.99,
      description: 'Diseño con detalles brillantes para niñas',
      details: {
        'Edad recomendada': '4-10 años',
        'Material': 'Acetato suave',
        'Protección UV': '100%',
        'Colores': 'Rosa, morado, dorado',
        'Características': 'Decoraciones seguras, patillas suaves'
      }
    },
    {
      name: 'Superhéroe Flex',
      imageSrc: '/images/ninos/superheroe.jpg',
      price: 94.99,
      description: 'Con diseños de superhéroes populares',
      details: {
        'Edad recomendada': '5-12 años',
        'Material': 'Silicona hipoalergénica',
        'Protección UV': '100%',
        'Diseños': 'Spiderman, Batman, Avengers',
        'Características': 'Antialérgico, flotante'
      }
    },
    {
      name: 'Mini Deportivos',
      imageSrc: '/images/ninos/deportivos.jpg',
      price: 99.99,
      description: 'Para niños activos y deportistas',
      details: {
        'Edad recomendada': '6-14 años',
        'Material': 'Policarbonato resistente',
        'Protección UV': '100%',
        'Colores': 'Rojo, azul, negro, amarillo',
        'Características': 'Correa ajustable, ventilación'
      }
    },
    {
      name: 'Bebé Seguro',
      imageSrc: '/images/ninos/bebe.jpg',
      price: 69.99,
      description: 'Primeros lentes para bebés (0-3 años)',
      details: {
        'Edad recomendada': '0-3 años',
        'Material': 'Silicona médica',
        'Protección UV': '100%',
        'Colores': 'Pasteles',
        'Características': 'Sin bisagras, diseño envolvente'
      }
    },
    {
      name: 'Estudiante Plus',
      imageSrc: '/images/ninos/estudiante.jpg',
      price: 109.99,
      description: 'Con filtro luz azul para dispositivos',
      details: {
        'Edad recomendada': '7-16 años',
        'Material': 'TR90 ligero',
        'Protección UV': '100%',
        'Tecnología': 'Filtro luz azul',
        'Características': 'Montura delgada, lentes antirayaduras'
      }
    },
    {
      name: 'Aviador Junior',
      imageSrc: '/images/ninos/aviador.jpg',
      price: 84.99,
      description: 'Estilo clásico en tamaño infantil',
      details: {
        'Edad recomendada': '5-12 años',
        'Material': 'Metal hipoalergénico',
        'Protección UV': '100%',
        'Colores': 'Dorado, plateado, negro',
        'Características': 'Peso ligero, lentes polarizadas'
      }
    },
    {
      name: 'Gafas Natación',
      imageSrc: '/images/ninos/natacion.jpg',
      price: 59.99,
      description: 'Lentes de natación con graduación',
      details: {
        'Edad recomendada': '4-14 años',
        'Material': 'PVC suave',
        'Protección UV': '100%',
        'Colores': 'Azul, rosa, negro, verde',
        'Características': 'Sellado hermético, antiempañante'
      }
    }
  ], []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLentes, setFilteredLentes] = useState(lentesNinos);
  const [activeFilter, setActiveFilter] = useState('Todos');

  const categories = ['Todos', 'Bebés', 'Niñas', 'Niños', 'Deportivos', 'Estudio', 'Protección', 'Natación'];

  useEffect(() => {
    const results = lentesNinos.filter(lente => {
      const matchesSearch = searchTerm === '' || 
        lente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lente.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.entries(lente.details).some(
          ([key, value]) => 
            key.toLowerCase().includes(searchTerm.toLowerCase()) || 
            String(value).toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = activeFilter === 'Todos' || 
        (activeFilter === 'Bebés' && lente.details['Edad recomendada'].includes('0-3')) ||
        (activeFilter === 'Niñas' && lente.name.toLowerCase().includes('princesa')) ||
        (activeFilter === 'Niños' && (lente.name.toLowerCase().includes('heroe') || lente.name.toLowerCase().includes('explorer'))) ||
        (activeFilter === 'Deportivos' && lente.name.toLowerCase().includes('deportivo')) ||
        (activeFilter === 'Estudio' && lente.name.toLowerCase().includes('estudiante')) ||
        (activeFilter === 'Protección' && lente.details['Características']?.toLowerCase().includes('protec')) ||
        (activeFilter === 'Natación' && lente.name.toLowerCase().includes('natación'));
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredLentes(results);
  }, [searchTerm, activeFilter, lentesNinos]);

  return (
    <main className={styles.ninosContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.headerSection}>
          <h1 className={styles.mainTitle}>Lentes Infantiles</h1>
          <p className={styles.subtitle}>
            Diseñados especialmente para la comodidad y seguridad de los más pequeños
          </p>
          <SearchBar 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por edad, material, características..."
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
            No se encontraron lentes infantiles que coincidan con tu búsqueda
          </p>
        ) : (
          <div className={styles.lentesGrid}>
            {filteredLentes.map((lente, index) => (
              <ProductCard
                key={`nino-${index}`}
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

export default Ninos;