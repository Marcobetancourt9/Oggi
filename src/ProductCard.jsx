import React from 'react';
import styles from './ProductCard.module.css';
import { useNavigate } from 'react-router-dom';
import { db } from '../credentials';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const ProductCard = ({ imageSrc, title, price, description, details }) => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleBuyClick = async () => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        alert("Por favor inicia sesión para comprar");
        navigate('/login');
        return;
      }

      // Crear objeto producto para agregar al carrito
      const productData = {
        name: title,
        price: price,
        quantity: 1,
        description: description,
        image: imageSrc,
        details: details,
        uid: user.uid,
        userEmail: user.email,
        createdAt: new Date()
      };

      // Agregar a la colección 'cart' en Firestore
      await addDoc(collection(db, "cart"), productData);
      
      // Navegar a la página de compra
      navigate('/compra');
    } catch (error) {
      console.error("Error al agregar producto al carrito: ", error);
      alert("Ocurrió un error al agregar el producto al carrito");
    }
  };

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
        
        <button 
          className={styles.viewButton}
          onClick={handleBuyClick}
        >
          Comprar
        </button>
      </div>
    </div>
  );
};

export default ProductCard;