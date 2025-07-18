import React, { useState, useEffect } from 'react';
import { db } from '../../credentials';
import { collection, getDocs, query, where } from 'firebase/firestore';
import styles from './Ninos.module.css';
import SearchBar from '../SearchBar';
import ProductCard from '../ProductCard';

const Ninos = () => {
  const [lentesNinos, setLentesNinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLentes, setFilteredLentes] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Todos');

  // Categorías específicas para lentes infantiles
  const categories = ['Todos', 'Bebés', 'Niñas', 'Niños', 'Deportivos', 'Estudio', 'Protección', 'Natación'];

  // Obtener lentes infantiles de Firestore
  useEffect(() => {
    const fetchLentesNinos = async () => {
      try {
        // Consulta para obtener solo productos de tipo "Lentes para niños"
        const q = query(
          collection(db, "products"), 
          where("type", "==", "Lentes para niños")
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
            category: doc.data().category || '' // Asegurar que tenemos la categoría
          });
        });
        
        setLentesNinos(lentesData);
        setFilteredLentes(lentesData);
      } catch (error) {
        console.error("Error fetching kids glasses: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLentesNinos();
  }, []);

  // Filtrar resultados
  useEffect(() => {
    const results = lentesNinos.filter(lente => {
      const matchesSearch = searchTerm === '' || 
        lente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lente.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lente.details && Object.entries(lente.details).some(
          ([key, value]) => 
            key.toLowerCase().includes(searchTerm.toLowerCase()) || 
            String(value).toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesCategory = activeFilter === 'Todos' || 
        (activeFilter === 'Bebés' && lente.category === 'Bebés') ||
        (activeFilter === 'Niñas' && lente.category === 'Niñas') ||
        (activeFilter === 'Niños' && lente.category === 'Niños') ||
        (activeFilter === 'Deportivos' && lente.category === 'Deportivos') ||
        (activeFilter === 'Estudio' && lente.category === 'Estudio') ||
        (activeFilter === 'Protección' && lente.category === 'Protección') ||
        (activeFilter === 'Natación' && lente.category === 'Natación');
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredLentes(results);
  }, [searchTerm, activeFilter, lentesNinos]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Cargando lentes infantiles...</p>
      </div>
    );
  }

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
            onChange={(value) => setSearchTerm(value)}
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
            {searchTerm || activeFilter !== 'Todos' 
              ? 'No se encontraron lentes que coincidan con tu búsqueda' 
              : 'No hay lentes infantiles disponibles'}
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

export default Ninos;