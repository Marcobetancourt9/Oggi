import React, { useState, useEffect } from 'react';
import { db } from '../../credentials'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs, query, where } from 'firebase/firestore';
import styles from './LentesSol.module.css';
import SearchBar from '../SearchBar';
import ProductCard from '../ProductCard';

const LentesSol = () => {
  const [lentes, setLentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLentes, setFilteredLentes] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Todos');

  const categories = ['Todos', 'Aviador', 'Wayfarer', 'Deportivo', 'Oversized', 'Polarizados', 'Espejados', 'Plegables', 'Cat Eye'];

  // Obtener lentes de sol de Firestore
  useEffect(() => {
    const fetchLentes = async () => {
      try {
        // Consulta para obtener solo productos de tipo "Lentes de sol"
        const q = query(
          collection(db, "products"), 
          where("type", "==", "Lentes de sol")
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
            details: doc.data().details || {}
          });
        });
        
        setLentes(lentesData);
        setFilteredLentes(lentesData);
      } catch (error) {
        console.error("Error fetching sunglasses: ", error);
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
        (lente.details && lente.details.Estilo === activeFilter) ||
        (activeFilter === 'Polarizados' && lente.description.toLowerCase().includes('polariz')) ||
        (activeFilter === 'Espejados' && lente.description.toLowerCase().includes('espej')) ||
        (activeFilter === 'Plegables' && lente.description.toLowerCase().includes('pleg'));
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredLentes(results);
  }, [searchTerm, activeFilter, lentes]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Cargando lentes de sol...</p>
      </div>
    );
  }

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
            {searchTerm || activeFilter !== 'Todos' 
              ? 'No se encontraron lentes que coincidan con tu búsqueda' 
              : 'No hay lentes de sol disponibles'}
          </p>
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
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default LentesSol;