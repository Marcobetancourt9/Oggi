import React, { useState, useEffect, useMemo } from 'react';
import styles from './Recetados.module.css';
import SearchBar from './SearchBar';
import ProductCard from './ProductCard';

const Recetados = () => {
  // Datos memoizados de lentes recetados
  const lentesRecetados = useMemo(() => [
    {
      name: 'Clásico Elegance',
      imageSrc: '/images/recetados/clasico.jpg',
      price: 129.99,
      description: 'Montura clásica que nunca pasa de moda, ideal para oficina',
      details: {
        'Material': 'Acetato italiano',
        'Tipo de lente': 'Monofocal',
        'Índice de refracción': '1.60',
        'Tratamientos': 'Antirreflejante, antirayaduras',
        'Forma': 'Rectangular',
        'Aro': '48-20-145'
      }
    },
    {
      name: 'UltraLight Modern',
      imageSrc: '/images/recetados/ultralight.jpg',
      price: 199.99,
      description: 'Lentes ultraligeros con tecnología de alta precisión',
      details: {
        'Material': 'TR90',
        'Tipo de lente': 'Progresivo',
        'Índice de refracción': '1.67',
        'Tratamientos': 'Antirreflejante premium, filtro luz azul',
        'Forma': 'Redonda',
        'Aro': '50-18-140'
      }
    },
    {
      name: 'Executive Titanium',
      imageSrc: '/images/recetados/titanium.jpg',
      price: 249.99,
      description: 'Montura de titanio para profesionales exigentes',
      details: {
        'Material': 'Titanio médico',
        'Tipo de lente': 'Bifocal',
        'Índice de refracción': '1.74',
        'Tratamientos': 'Antirreflejante, hidrofóbico, espejado',
        'Forma': 'Aviador',
        'Aro': '52-20-150'
      }
    },
    {
      name: 'Flex Comfort',
      imageSrc: '/images/recetados/flex.jpg',
      price: 159.99,
      description: 'Diseño flexible para máximo confort en uso prolongado',
      details: {
        'Material': 'Silicona y acero flexible',
        'Tipo de lente': 'Monofocal',
        'Índice de refracción': '1.59',
        'Tratamientos': 'Anti-fatiga, protección UV',
        'Forma': 'Ovalada',
        'Aro': '51-19-145'
      }
    },
    {
      name: 'Vintage Retro',
      imageSrc: '/images/recetados/vintage.jpg',
      price: 179.99,
      description: 'Estilo retro con montura de acetato grueso',
      details: {
        'Material': 'Acetato de celulosa',
        'Tipo de lente': 'Monofocal',
        'Índice de refracción': '1.60',
        'Tratamientos': 'Antirreflejante clásico',
        'Forma': 'Wayfarer',
        'Aro': '54-22-150'
      }
    },
    {
      name: 'Digital Protect',
      imageSrc: '/images/recetados/digital.jpg',
      price: 229.99,
      description: 'Tecnología avanzada para usuarios de pantallas',
      details: {
        'Material': 'Aleación ultraligera',
        'Tipo de lente': 'Ocupacional',
        'Índice de refracción': '1.67',
        'Tratamientos': 'Filtro luz azul 50%, antirreflejante',
        'Forma': 'Rectangular',
        'Aro': '49-21-145'
      }
    },
    {
      name: 'Sport Vision',
      imageSrc: '/images/recetados/sport.jpg',
      price: 189.99,
      description: 'Diseño deportivo con agarre seguro',
      details: {
        'Material': 'Grilamid TR90',
        'Tipo de lente': 'Monofocal curvo',
        'Índice de refracción': '1.59',
        'Tratamientos': 'Polarizado, antiempañante',
        'Forma': 'Envolvente',
        'Aro': '55-24-155'
      }
    },
    {
      name: 'Minimal Ultra',
      imageSrc: '/images/recetados/minimal.jpg',
      price: 169.99,
      description: 'Diseño minimalista casi invisible',
      details: {
        'Material': 'Acetato japonés',
        'Tipo de lente': 'Monofocal',
        'Índice de refracción': '1.74',
        'Tratamientos': 'Superhidrofóbico',
        'Forma': 'Redondo delgado',
        'Aro': '47-19-140'
      }
    }
  ], []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLentes, setFilteredLentes] = useState(lentesRecetados);
  const [activeFilter, setActiveFilter] = useState('Todos');

  const categories = ['Todos', 'Monofocal', 'Bifocal', 'Progresivo', 'Ocupacional', 'Deportivo', 'Premium', 'Digital'];

  useEffect(() => {
    const results = lentesRecetados.filter(lente => {
      const matchesSearch = searchTerm === '' || 
        lente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lente.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.entries(lente.details).some(
          ([key, value]) => 
            key.toLowerCase().includes(searchTerm.toLowerCase()) || 
            String(value).toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = activeFilter === 'Todos' || 
        lente.details['Tipo de lente'].toLowerCase().includes(activeFilter.toLowerCase()) ||
        (activeFilter === 'Premium' && lente.price > 200) ||
        (activeFilter === 'Digital' && lente.description.toLowerCase().includes('digital'));
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredLentes(results);
  }, [searchTerm, activeFilter, lentesRecetados]);

  return (
    <main className={styles.recetadosContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.headerSection}>
          <h1 className={styles.mainTitle}>Lentes Recetados</h1>
          <p className={styles.subtitle}>
            Precisión óptica personalizada para cada necesidad visual
          </p>
          <SearchBar 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por tipo de lente, material, tratamientos..."
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
            {filteredLentes.map((lente, index) => (
              <ProductCard
                key={`recetado-${index}`}
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

export default Recetados;