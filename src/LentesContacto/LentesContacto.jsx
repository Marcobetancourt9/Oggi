import React, { useState, useEffect } from 'react';
import { db } from '../../credentials';
import { collection, getDocs, query, where } from 'firebase/firestore';
import styles from './LentesContacto.module.css';
import SearchBar from '../SearchBar';
import ProductCard from '../ProductCard';

const LentesContacto = () => {
  const [lentes, setLentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLentes, setFilteredLentes] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Todos');

  // Categorías específicas para lentes de contacto
  const categories = [
    'Todos',
    'Diarios',
    'Quincenales', 
    'Mensuales',
    'Tóricos',
    'Multifocales',
    'Cosméticos',
    'Ojos Secos',
    'Nocturnas'
  ];

  // Obtener lentes de contacto de Firestore
  useEffect(() => {
    const fetchLentes = async () => {
      try {
        // Consulta para obtener solo productos de tipo "Lentes de contacto"
        const q = query(
          collection(db, "products"), 
          where("type", "==", "Lentes de contacto")
        );
        
        const querySnapshot = await getDocs(q);
        const lentesData = [];
        
        querySnapshot.forEach((doc) => {
          lentesData.push({ 
            id: doc.id,
            name: doc.data().name,
            imageSrc: doc.data().imageSrc,
            price: doc.data().price,
            description: doc.data().description,
            details: doc.data().details || {},
            category: doc.data().category || ''
          });
        });
        
        setLentes(lentesData);
        setFilteredLentes(lentesData);
      } catch (error) {
        console.error("Error fetching contact lenses: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLentes();
  }, []);

  // Filtrar resultados
  useEffect(() => {
    const results = lentes.filter(lente => {
      const matchesSearch = searchTerm === '' || 
        lente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lente.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lente.details && Object.entries(lente.details).some(
          ([key, value]) => 
            key.toLowerCase().includes(searchTerm.toLowerCase()) || 
            String(value).toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesCategory = activeFilter === 'Todos' || 
        (lente.category && lente.category.toLowerCase().includes(activeFilter.toLowerCase())) ||
        (lente.details && lente.details.Tipo && lente.details.Tipo.toLowerCase().includes(activeFilter.toLowerCase()));
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredLentes(results);
  }, [searchTerm, activeFilter, lentes]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando lentes de contacto...</p>
      </div>
    );
  }

  return (
    <main className={styles.lentesContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.headerSection}>
          <h1 className={styles.mainTitle}>
            <span className={styles.titleGradient}>Catálogo de Lentes de Contacto</span>
          </h1>
          <p className={styles.subtitle}>
            Encuentra los lentes perfectos para tu visión y estilo de vida
          </p>
          <div className={styles.searchBarWrapper}>
            <SearchBar 
              value={searchTerm} 
              onChange={(value) => setSearchTerm(value)}
              placeholder="Buscar por tipo, material, uso especial..."
            />
          </div>
        </header>

        {/* Menú de categorías con efecto hover */}
        <div className={styles.menuCategories}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryButton} ${activeFilter === category ? styles.active : ''}`}
              onClick={() => setActiveFilter(category)}
              aria-label={`Filtrar por ${category}`}
            >
              <span className={styles.buttonText}>{category}</span>
              <span className={styles.buttonHoverEffect}></span>
            </button>
          ))}
        </div>

        {filteredLentes.length === 0 ? (
          <div className={styles.noResultsContainer}>
            <p className={styles.noResults}>
              {searchTerm || activeFilter !== 'Todos' 
                ? 'No se encontraron lentes que coincidan con tu búsqueda' 
                : 'No hay lentes de contacto disponibles'}
            </p>
            <button 
              className={styles.resetButton}
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('Todos');
              }}
            >
              Reiniciar búsqueda
            </button>
          </div>
        ) : (
          <div className={styles.lentesGrid}>
            {filteredLentes.map((lente) => (
              <ProductCard
                key={lente.id}
                id={lente.id}
                imageSrc={lente.imageSrc}
                title={lente.name}
                price={lente.price}
                description={lente.description}
                details={lente.details}
                cardClass={styles.productCard}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default LentesContacto;