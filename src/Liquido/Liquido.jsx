import React, { useState, useEffect, useMemo } from 'react';
import styles from './Liquido.module.css';
import SearchBar from './SearchBar';
import ProductCard from './ProductCard';

const Liquido = () => {
  // Datos memoizados de productos limpiadores
  const productosLimpieza = useMemo(() => [
    {
      name: 'Solución Limpiadora Premium',
      imageSrc: '/images/liquido/premium.jpg',
      price: 12.99,
      description: 'Fórmula avanzada que limpia, desinfecta y evita el empañamiento',
      details: {
        'Tipo': 'Multiusos',
        'Volumen': '120 ml',
        'Composición': 'Libre de alcohol y amoníaco',
        'Efectividad': 'Antibacteriana (99.9%)',
        'Aplicación': 'Para todo tipo de lentes y monturas',
        'Uso recomendado': 'Diario'
      }
    },
    {
      name: 'Toallitas Desinfectantes',
      imageSrc: '/images/liquido/toallitas.jpg',
      price: 9.99,
      description: 'Toallitas prehumedecidas para limpieza rápida y eficaz',
      details: {
        'Tipo': 'Toallitas',
        'Cantidad': '50 unidades',
        'Composición': 'Sin fosfatos',
        'Efectividad': 'Elimina bacterias y virus',
        'Aplicación': 'Ideal para viajes',
        'Uso recomendado': 'Cada 2-3 días'
      }
    },
    {
      name: 'Kit Limpieza Completo',
      imageSrc: '/images/liquido/kit.jpg',
      price: 24.99,
      description: 'Incluye spray limpiador, microfibra y estuche de viaje',
      details: {
        'Tipo': 'Kit completo',
        'Contenido': 'Spray 100ml + 2 microfibras + estuche',
        'Composición': 'Fórmula ecológica',
        'Efectividad': 'Limpia profundamente',
        'Aplicación': 'Para mantenimiento profesional',
        'Uso recomendado': 'Semanal'
      }
    },
    {
      name: 'Anti-empañante Deportivo',
      imageSrc: '/images/liquido/antiempanante.jpg',
      price: 15.99,
      description: 'Evita el empañamiento durante actividades físicas',
      details: {
        'Tipo': 'Anti-empañante',
        'Volumen': '60 ml',
        'Composición': 'Base acuosa',
        'Efectividad': 'Dura hasta 72 horas',
        'Aplicación': 'Para deportes y mascarillas',
        'Uso recomendado': 'Cada 3 días'
      }
    },
    {
      name: 'Espuma Limpiadora Sensitive',
      imageSrc: '/images/liquido/espuma.jpg',
      price: 14.50,
      description: 'Para pieles sensibles y lentes con tratamientos especiales',
      details: {
        'Tipo': 'Espuma',
        'Volumen': '150 ml',
        'Composición': 'Hipoalergénica',
        'Efectividad': 'Limpia sin irritar',
        'Aplicación': 'Lentes con antirreflejante',
        'Uso recomendado': 'Diario'
      }
    },
    {
      name: 'Limpia Cristales Profundo',
      imageSrc: '/images/liquido/profundo.jpg',
      price: 18.99,
      description: 'Elimina manchas difíciles y residuos de grasa',
      details: {
        'Tipo': 'Limpiador intensivo',
        'Volumen': '100 ml',
        'Composición': 'Con tensioactivos suaves',
        'Efectividad': 'Remueve hasta aceites',
        'Aplicación': 'Para limpieza mensual profunda',
        'Uso recomendado': 'Mensual'
      }
    },
    {
      name: 'Paño Microfibra UltraSoft',
      imageSrc: '/images/liquido/microfibra.jpg',
      price: 7.99,
      description: 'Paño de alta calidad para limpieza sin rayones',
      details: {
        'Tipo': 'Accesorio',
        'Material': 'Microfibra premium',
        'Tamaño': '15x15 cm',
        'Efectividad': 'Atrapa partículas',
        'Aplicación': 'Para secado sin marcas',
        'Lavable': 'Hasta 100 veces'
      }
    },
    {
      name: 'Spray Antiestático',
      imageSrc: '/images/liquido/antiestatico.jpg',
      price: 13.50,
      description: 'Reduce la atracción de polvo y partículas',
      details: {
        'Tipo': 'Tratamiento',
        'Volumen': '80 ml',
        'Composición': 'Iónico',
        'Efectividad': 'Protección 48h',
        'Aplicación': 'Después de limpiar',
        'Uso recomendado': '2-3 veces por semana'
      }
    }
  ], []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProductos, setFilteredProductos] = useState(productosLimpieza);
  const [activeFilter, setActiveFilter] = useState('Todos');

  const categories = ['Todos', 'Spray', 'Toallitas', 'Kit', 'Anti-empañante', 'Accesorios', 'Profundo', 'Hipoalergénico'];

  useEffect(() => {
    const results = productosLimpieza.filter(producto => {
      const matchesSearch = searchTerm === '' || 
        producto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.entries(producto.details).some(
          ([key, value]) => 
            key.toLowerCase().includes(searchTerm.toLowerCase()) || 
            String(value).toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = activeFilter === 'Todos' || 
        (activeFilter === 'Spray' && (producto.name.toLowerCase().includes('spray') || producto.details.Tipo.toLowerCase().includes('spray'))) ||
        (activeFilter === 'Toallitas' && producto.name.toLowerCase().includes('toallitas')) ||
        (activeFilter === 'Kit' && producto.name.toLowerCase().includes('kit')) ||
        (activeFilter === 'Anti-empañante' && producto.name.toLowerCase().includes('empañ')) ||
        (activeFilter === 'Accesorios' && producto.details.Tipo === 'Accesorio') ||
        (activeFilter === 'Profundo' && producto.description.toLowerCase().includes('profundo')) ||
        (activeFilter === 'Hipoalergénico' && producto.details.Composición.toLowerCase().includes('hipoalergénic'));
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredProductos(results);
  }, [searchTerm, activeFilter, productosLimpieza]);

  return (
    <main className={styles.liquidoContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.headerSection}>
          <h1 className={styles.mainTitle}>Soluciones de Limpieza para Lentes</h1>
          <p className={styles.subtitle}>
            Mantén tus lentes impecables con nuestros productos profesionales
          </p>
          <SearchBar 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por tipo, composición, uso..."
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

        {filteredProductos.length === 0 ? (
          <p className={styles.noResults}>
            No se encontraron productos que coincidan con tu búsqueda
          </p>
        ) : (
          <div className={styles.productosGrid}>
            {filteredProductos.map((producto, index) => (
              <ProductCard
                key={`liquido-${index}`}
                imageSrc={producto.imageSrc}
                title={producto.name}
                price={producto.price}
                description={producto.description}
                details={producto.details}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Liquido;