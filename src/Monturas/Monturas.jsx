'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../credentials';
import { collection, getDocs, query, where } from 'firebase/firestore';
import styles from './Monturas.module.css';
import SearchBar from '../SearchBar';
import ProductCard from '../ProductCard';

const Monturas = () => {
  const [monturas, setMonturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMonturas, setFilteredMonturas] = useState([]);

  // Obtener monturas de Firestore
  useEffect(() => {
    const fetchMonturas = async () => {
      try {
        // Consulta para obtener solo productos de tipo "Monturas"
        const q = query(
          collection(db, "products"), 
          where("type", "==", "Monturas")
        );
        
        const querySnapshot = await getDocs(q);
        const monturasData = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          monturasData.push({ 
            id: doc.id,
            name: data.name,
            imageSrc: data.imageSrc,
            price: data.price,
            description: data.description,
            material: data.details?.Material || '',
            colors: data.details?.Colores ? data.details.Colores.split(', ') : []
          });
        });
        
        setMonturas(monturasData);
        setFilteredMonturas(monturasData);
      } catch (error) {
        console.error("Error fetching frames: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonturas();
  }, []);

  // Filtrar resultados
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMonturas(monturas);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = monturas.filter(
        (montura) =>
          montura.name.toLowerCase().includes(term) ||
          montura.description.toLowerCase().includes(term) ||
          montura.material.toLowerCase().includes(term) ||
          montura.colors.some(color => color.toLowerCase().includes(term)) ||
          String(montura.price).includes(term)
      );
      setFilteredMonturas(filtered);
    }
  }, [searchTerm, monturas]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando monturas...</p>
      </div>
    );
  }

  return (
    <main className={styles.monturasContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.headerSection}>
          <h1 className={styles.mainTitle}>
            Catálogo de Monturas Ópticas
          </h1>
          <p className={styles.subtitle}>Encuentra el estilo perfecto para tus lentes</p>
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm}
            placeholder="Buscar por nombre, material, color o precio..."
          />
        </header>

        {filteredMonturas.length === 0 ? (
          <div className={styles.noResultsContainer}>
            <p className={styles.noResults}>
              {searchTerm 
                ? 'No se encontraron monturas que coincidan con tu búsqueda' 
                : 'No hay monturas disponibles'}
            </p>
            {searchTerm && (
              <button 
                className={styles.resetButton}
                onClick={() => setSearchTerm('')}
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className={styles.monturasGrid}>
            {filteredMonturas.map((montura) => (
              <ProductCard
                key={montura.id}
                id={montura.id}
                imageSrc={montura.imageSrc}
                title={montura.name}
                price={montura.price}
                description={montura.description}
                details={{
                  Material: montura.material,
                  Colores: montura.colors.join(', ')
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Monturas;