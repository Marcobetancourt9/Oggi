import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../credentials';
import { StarIcon } from '@heroicons/react/24/solid';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import styles from './Blog.module.css';

const Blog = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: '',
    comment: '',
    rating: 0,
    date: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtener reseñas de Firestore
  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reviewsData = [];
      querySnapshot.forEach((doc) => {
        reviewsData.push({ id: doc.id, ...doc.data() });
      });
      setReviews(reviewsData);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({
      ...newReview,
      [name]: value
    });
  };

  const handleRatingChange = (rating) => {
    setNewReview({
      ...newReview,
      rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment || newReview.rating === 0) {
      alert('Por favor completa todos los campos y selecciona una calificación');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        ...newReview,
        date: new Date().toISOString()
      });
      setNewReview({
        name: '',
        comment: '',
        rating: 0,
        date: ''
      });
    } catch (error) {
      console.error('Error al agregar reseña: ', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Obtener iniciales para el avatar
  const getInitials = (name) => {
    if (!name) return 'US';
    const parts = name.split(' ');
    let initials = parts[0][0];
    if (parts.length > 1) initials += parts[1][0];
    return initials.toUpperCase();
  };

  // Textos descriptivos para cada puntuación
  const ratingDescriptions = [
    "Muy pobre",
    "Pobre",
    "Aceptable",
    "Muy bueno",
    "Excelente"
  ];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Opiniones de Expertos</h1>
          <p className={styles.subtitle}>
            Comparte tu evaluación profesional y consulta las críticas especializadas de nuestros usuarios.
          </p>
        </header>

        {/* Formulario para nueva reseña */}
        <section className={styles.reviewForm}>
          <h2 className={styles.formTitle}>Tu Evaluación</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.inputLabel}>
                NOMBRE O IDENTIFICADOR
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newReview.name}
                onChange={handleInputChange}
                className={styles.textInput}
                placeholder="Ej: Carlos Rodríguez"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>CALIFICACIÓN</label>
              <div className={styles.ratingContainer}>
                <div className={styles.ratingStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className={styles.starButton}
                      aria-label={`Calificar con ${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
                    >
                      <StarIcon
                        className={
                          (hoverRating || newReview.rating) >= star 
                            ? styles.starIconFilled 
                            : hoverRating >= star
                              ? styles.starIconHover
                              : styles.starIconEmpty
                        }
                      />
                    </button>
                  ))}
                  <span className={styles.ratingText}>
                    {newReview.rating > 0 
                      ? `${ratingDescriptions[newReview.rating - 1]} (${newReview.rating}/5)`
                      : 'Selecciona tu calificación'}
                  </span>
                </div>
                <div className={styles.ratingScale}>
                  <span 
                    className={`${styles.ratingScaleItem} ${(hoverRating || newReview.rating) >= 1 ? 'active' : ''}`}
                    onClick={() => handleRatingChange(1)}
                  >
                    Muy pobre
                  </span>
                  <span 
                    className={`${styles.ratingScaleItem} ${(hoverRating || newReview.rating) >= 2 ? 'active' : ''}`}
                    onClick={() => handleRatingChange(2)}
                  >
                    Pobre
                  </span>
                  <span 
                    className={`${styles.ratingScaleItem} ${(hoverRating || newReview.rating) >= 3 ? 'active' : ''}`}
                    onClick={() => handleRatingChange(3)}
                  >
                    Aceptable
                  </span>
                  <span 
                    className={`${styles.ratingScaleItem} ${(hoverRating || newReview.rating) >= 4 ? 'active' : ''}`}
                    onClick={() => handleRatingChange(4)}
                  >
                    Muy bueno
                  </span>
                  <span 
                    className={`${styles.ratingScaleItem} ${(hoverRating || newReview.rating) >= 5 ? 'active' : ''}`}
                    onClick={() => handleRatingChange(5)}
                  >
                    Excelente
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="comment" className={styles.inputLabel}>
                ANÁLISIS DETALLADO
              </label>
              <textarea
                id="comment"
                name="comment"
                rows="6"
                value={newReview.comment}
                onChange={handleInputChange}
                className={`${styles.textInput} ${styles.textarea}`}
                placeholder="Proporciona una evaluación detallada y fundamentada..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`${styles.submitButton} ${isSubmitting ? styles.submitButtonDisabled : ''}`}
            >
              {isSubmitting ? (
                'Enviando Evaluación...'
              ) : (
                <>
                  <PaperAirplaneIcon style={{ width: '20px', height: '20px', marginRight: '10px' }} />
                  Publicar Evaluación
                </>
              )}
            </button>
          </form>
        </section>

        {/* Lista de reseñas */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.sectionTitle}>Evaluaciones Recientes</h2>
          
          {reviews.length === 0 ? (
            <div className={styles.emptyReviews}>
              <p className={styles.emptyText}>Aún no hay evaluaciones. Sé el primero en compartir tu análisis.</p>
            </div>
          ) : (
            <div className={styles.reviewList}>
              {reviews.map((review) => (
                <article key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.userAvatar}>
                      {getInitials(review.name)}
                    </div>
                    <div className={styles.reviewMeta}>
                      <h3 className={styles.reviewName}>{review.name}</h3>
                      <time className={styles.reviewDate}>{formatDate(review.date)}</time>
                      <div className={styles.reviewRating}>
                        <div className={styles.reviewStars}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className={styles.reviewStar}
                              style={{ 
                                opacity: review.rating >= star ? 1 : 0.3,
                                filter: review.rating >= star ? 'drop-shadow(0 0 2px rgba(245, 158, 11, 0.5))' : 'none'
                              }}
                            />
                          ))}
                        </div>
                        <span className={styles.reviewRatingText}>
                          {ratingDescriptions[review.rating - 1]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className={styles.reviewComment}>{review.comment}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Blog;