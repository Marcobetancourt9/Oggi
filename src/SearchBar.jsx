'use client';

import React, { useState } from 'react';
import styles from './SearchBar.module.css';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ value = '', onChange, placeholder = '' }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e) => {
    // Llamamos a onChange con solo el valor, no con el evento completo
    onChange(e.target.value);
  };

  const handleClearSearch = () => {
    onChange('');
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={`${styles.searchBar} ${isFocused ? styles.focused : ''}`}>
        <FiSearch className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label="Buscar productos"
        />
        {value && (
          <button 
            className={styles.clearButton}
            onClick={handleClearSearch}
            aria-label="Limpiar búsqueda"
            type="button"
          >
            <FiX />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;