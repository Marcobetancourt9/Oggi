import React, { useState, useEffect } from 'react';
import { db } from '../../credentials';
import { collection, getDocs, query, where } from 'firebase/firestore';
import styles from './Estuches.module.css';
import SearchBar from '../SearchBar';
import ProductCard from '../ProductCard';

const Estuches = () => {
  const [estuches, setEstuches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEstuches, setFilteredEstuches] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Todos');

  // Categorías para filtrado
  const categories = [
    'Todos',
    'Cuero',
    'Plegable',
    'Aluminio',
    'Deportivo',
    'Vintage',
    'Lujo',
    'Madera',
    'Rígido'
  ];

  // Obtener estuches de Firestore
  useEffect(() => {
    const fetchEstuches = async () => {
      try {
        // Consulta para obtener solo productos de tipo "Estuches"
        const q = query(
          collection(db, "products"), 
          where("type", "==", "Estuches")
        );
        
        const querySnapshot = await getDocs(q);
        const estuchesData = [];
        
        querySnapshot.forEach((doc) => {
          estuchesData.push({ 
            id: doc.id,
            name: doc.data().name,
            imageSrc: doc.data().imageSrc,
            price: doc.data().price,
            description: doc.data().description,
            details: doc.data().details || {},
            category: doc.data().category || ''
          });
        });
        
        setEstuches(estuchesData);
        setFilteredEstuches(estuchesData);
      } catch (error) {
        console.error("Error fetching cases: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstuches();
  }, []);

  // Filtrar resultados
  useEffect(() => {
    const results = estuches.filter(estuche => {
      const matchesSearch = searchTerm === '' || 
        estuche.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estuche.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (estuche.details && Object.entries(estuche.details).some(
          ([key, value]) => 
            key.toLowerCase().includes(searchTerm.toLowerCase()) || 
            String(value).toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesCategory = activeFilter === 'Todos' || 
        (estuche.category && estuche.category.toLowerCase().includes(activeFilter.toLowerCase())) ||
        (estuche.details && estuche.details.Material && estuche.details.Material.toLowerCase().includes(activeFilter.toLowerCase())) ||
        (activeFilter === 'Plegable' && estuche.name.toLowerCase().includes('plegable')) ||
        (activeFilter === 'Deportivo' && estuche.name.toLowerCase().includes('deportivo')) ||
        (activeFilter === 'Vintage' && estuche.name.toLowerCase().includes('vintage')) ||
        (activeFilter === 'Lujo' && estuche.name.toLowerCase().includes('lujo')) ||
        (activeFilter === 'Rígido' && estuche.name.toLowerCase().includes('rígido'));
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredEstuches(results);
  }, [searchTerm, activeFilter, estuches]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Cargando estuches...</p>
      </div>
    );
  }

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
            onChange={(value) => setSearchTerm(value)}
            placeholder="Buscar por material, color, características..."
          />
        </header>

        {/* Menú de categorías - Se mantienen los estilos CSS originales */}
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
            {searchTerm || activeFilter !== 'Todos' 
              ? 'No se encontraron estuches que coincidan con tu búsqueda' 
              : 'No hay estuches disponibles'}
          </p>
        ) : (
          <div className={styles.estuchesGrid}>
            {filteredEstuches.map((estuche) => (
              <ProductCard
                key={estuche.id}
                id={estuche.id}
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