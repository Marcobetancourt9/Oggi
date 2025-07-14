'use client';

import React, { useState } from 'react';
import styles from './SearchBar.module.css';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ value = '', onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e) => {
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
          placeholder="Buscar monturas por nombre, material, color o precio..."
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label="Buscar monturas ópticas"
        />
        {value && (
          <button 
            className={styles.clearButton}
            onClick={handleClearSearch}
            aria-label="Limpiar búsqueda"
          >
            <FiX />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;