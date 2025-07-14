import React from 'react';
import styles from './ProductCard.module.css';

const ProductCard = ({ imageSrc, title, price, description, details }) => {
  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer}>
        <img src={imageSrc} alt={title} className={styles.productImage} />
      </div>
      <div className={styles.productInfo}>
        <h3 className={styles.productTitle}>{title}</h3>
        <p className={styles.productPrice}>${price.toFixed(2)}</p>
        <p className={styles.productDescription}>{description}</p>
        
        <div className={styles.detailsContainer}>
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className={styles.detailItem}>
              <span className={styles.detailLabel}>{key}:</span>
              <span className={styles.detailValue}>{value}</span>
            </div>
          ))}
        </div>
        
        <button className={styles.viewButton}>Ver detalles</button>
      </div>
    </div>
  );
};

export default ProductCard;