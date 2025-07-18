import React, { useState, useRef } from 'react';
import { uploadImage } from '../../supabaseCredentials';
import { db } from '../../credentials';
import { collection, addDoc } from 'firebase/firestore';
import styles from './ProductForm.module.css';

const ProductForm = () => {
    const [product, setProduct] = useState({
        name: '',
        imageSrc: '',
        price: '',
        description: '',
        type: '',
        category: '', // Nuevo campo para categoría específica
        details: {
            'Estilo': '',
            'Material': '',
            'Protección UV': '',
            'Colores disponibles': '',
            'Forma': ''
        }
    });
    
    const productTypes = [
        'Lentes de contacto',
        'Lentes de sol',
        'Lentes para niños',
        'Monturas',
        'Estuches'
    ];

    // Categorías específicas para Lentes de sol
    const sunglassesCategories = [
        'Aviador',
        'Wayfarer',
        'Deportivo',
        'Oversized',
        'Polarizados',
        'Espejados',
        'Plegables',
        'Cat Eye'
    ];

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleDetailChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            details: {
                ...prev.details,
                [name]: value
            }
        }));
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setIsSubmitting(true);
            setUploadProgress(0);
            
            if (!file.type.match('image.*')) {
                throw new Error('Solo se permiten imágenes (JPEG, PNG, GIF)');
            }
            
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('El tamaño máximo es 5MB');
            }

            const imageUrl = await uploadImage(file);
            
            if (!imageUrl) {
                throw new Error('No se recibió URL de la imagen');
            }

            setProduct(prev => ({ ...prev, imageSrc: imageUrl }));
            setUploadProgress(100);
            
        } catch (error) {
            console.error('Error en subida de imagen:', error);
            setUploadProgress(0);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!product.imageSrc) {
            alert('Por favor sube una imagen del producto');
            return;
        }

        // Validación especial para Lentes de sol
        if (product.type === 'Lentes de sol' && !product.category) {
            alert('Por favor selecciona una categoría para los lentes de sol');
            return;
        }

        setIsSubmitting(true);

        try {
            // Estructura base del producto
            const productData = {
                name: product.name,
                imageSrc: product.imageSrc,
                price: parseFloat(product.price),
                description: product.description,
                type: product.type,
                details: product.details,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Campos adicionales para Lentes de sol
            if (product.type === 'Lentes de sol') {
                productData.category = product.category;
                productData.details.Estilo = product.category; // Asignamos la categoría como Estilo
            }

            // Guardar en Firestore
            const docRef = await addDoc(collection(db, "products"), productData);
            
            console.log("Producto guardado con ID: ", docRef.id);
            setSuccessMessage('¡Producto guardado exitosamente!');
            
            // Resetear formulario
            setTimeout(() => {
                setSuccessMessage('');
                setProduct({
                    name: '',
                    imageSrc: '',
                    price: '',
                    description: '',
                    type: '',
                    category: '',
                    details: {
                        'Estilo': '',
                        'Material': '',
                        'Protección UV': '',
                        'Colores disponibles': '',
                        'Forma': ''
                    }
                });
                setUploadProgress(0);
            }, 3000);
            
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error al guardar el producto: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h1 className={styles.title}>Agregar Nuevo Producto</h1>
            
            {successMessage && (
                <div className={styles.successMessage}>
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="name">
                        Nombre del Producto
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={product.name}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="type">
                        Tipo de Producto
                    </label>
                    <select
                        id="type"
                        name="type"
                        value={product.type}
                        onChange={handleInputChange}
                        className={`${styles.input} ${styles.select}`}
                        required
                    >
                        <option value="">Seleccione un tipo</option>
                        {productTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Selector de categoría (solo para Lentes de sol) */}
                {product.type === 'Lentes de sol' && (
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="category">
                            Categoría de Lentes de Sol
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={product.category}
                            onChange={handleInputChange}
                            className={`${styles.input} ${styles.select}`}
                            required
                        >
                            <option value="">Seleccione una categoría</option>
                            {sunglassesCategories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Resto del formulario (imagen, precio, descripción, detalles) */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Imagen del Producto
                    </label>
                    <div className={styles.fileInputWrapper} onClick={triggerFileInput}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageUpload}
                            className={styles.fileInput}
                            required
                        />
                        <div className={styles.fileInputLabel}>
                            {product.imageSrc ? 'Cambiar imagen' : 'Seleccionar archivo'}
                        </div>
                    </div>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className={styles.progressBar}>
                            <div 
                                className={styles.progressFill} 
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    )}
                    {product.imageSrc && (
                        <div className={styles.imagePreview}>
                            <img 
                                src={product.imageSrc} 
                                alt="Vista previa" 
                                className={styles.previewImage}
                            />
                            <p className={styles.imageUrl}>URL de la imagen: {product.imageSrc}</p>
                        </div>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="price">
                        Precio
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={product.price}
                        onChange={handleInputChange}
                        className={styles.input}
                        step="0.01"
                        min="0"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="description">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={product.description}
                        onChange={handleInputChange}
                        className={`${styles.input} ${styles.textarea}`}
                        rows="5"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <h2 className={styles.detailsTitle}>Detalles del Producto</h2>
                    
                    <div className={styles.detailsGrid}>
                        {Object.entries(product.details).map(([key, value]) => (
                            <div key={key} className={styles.detailCard}>
                                <label className={styles.label} htmlFor={`detail-${key}`}>
                                    {key}
                                </label>
                                <input
                                    type="text"
                                    id={`detail-${key}`}
                                    name={key}
                                    value={value}
                                    onChange={handleDetailChange}
                                    className={styles.input}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !product.imageSrc}
                    className={styles.submitButton}
                >
                    {isSubmitting ? (
                        <span>Guardando...</span>
                    ) : (
                        <span>Guardar Producto</span>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;