'use client';

import React, { useState, useEffect } from 'react';
import styles from './Monturas.module.css';
import SearchBar from '../SearchBar';
import ProductCard from '../ProductCard'; // Asumo que tienes este componente

const Monturas = () => {
  // Datos de las monturas disponibles
  const monturas = [
    {
      name: 'Montura Clásica de Acero',
      imageSrc: '/images/monturas/clasica-acero.jpg',
      price: 89.99,
      description: 'Diseño atemporal en acero inoxidable, ideal para uso diario',
      colors: ['Plateado', 'Oro', 'Negro'],
      material: 'Acero inoxidable'
    },
    {
      name: 'Montura Ultra Ligera Titanio',
      imageSrc: '/images/monturas/titanio-ligera.jpg',
      price: 149.99,
      description: 'Titanio de grado óptico, peso mínimo y máxima durabilidad',
      colors: ['Grafito', 'Azul oscuro'],
      material: 'Titanio'
    },
    {
      name: 'Montura Deportiva Flexible',
      imageSrc: '/images/monturas/deportiva-flexible.jpg',
      price: 75.50,
      description: 'Material TR90 resistente para actividades físicas',
      colors: ['Rojo', 'Negro', 'Azul'],
      material: 'TR90'
    },
    {
      name: 'Montura Elegante de Carey',
      imageSrc: '/images/monturas/carey-elegante.jpg',
      price: 120.00,
      description: 'Patrón clásico de carey con terminaciones metálicas',
      colors: ['Marrón/Ámbar', 'Negro/Gris'],
      material: 'Acetato'
    },
    {
      name: 'Montura Minimalista Aluminio',
      imageSrc: '/images/monturas/minimalista-aluminio.jpg',
      price: 95.75,
      description: 'Líneas limpias y diseño sin tornillos visibles',
      colors: ['Plateado', 'Oro rosa'],
      material: 'Aluminio'
    },
    {
      name: 'Montura Vintage de Acetato',
      imageSrc: '/images/monturas/vintage-acetato.jpg',
      price: 110.00,
      description: 'Estilo retro con colores vibrantes y formas redondeadas',
      colors: ['Tortuga', 'Verde esmeralda', 'Burdeos'],
      material: 'Acetato'
    },
    {
      name: 'Montura Infantil Resistente',
      imageSrc: '/images/monturas/infantil-resistente.jpg',
      price: 65.99,
      description: 'Diseñada para niños, con bisagras de resorte y materiales irrompibles',
      colors: ['Azul', 'Rosa', 'Verde', 'Morado'],
      material: 'Policarbonato'
    },
    {
      name: 'Montura Premium de Madera',
      imageSrc: '/images/monturas/premium-madera.jpg',
      price: 179.99,
      description: 'Hecha a mano con madera sostenible y detalles metálicos',
      colors: ['Nogal', 'Cerezo', 'Ébano'],
      material: 'Madera/Acero'
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMonturas, setFilteredMonturas] = useState(monturas);

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
  }, [searchTerm]);

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
          <p className={styles.noResults}>No se encontraron monturas que coincidan con tu búsqueda</p>
        ) : (
          <div className={styles.monturasGrid}>
            {filteredMonturas.map((montura, index) => (
              <ProductCard
                key={index}
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