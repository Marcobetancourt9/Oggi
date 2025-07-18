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
        category: '',
        details: {
            'Estilo': '',
            'Material': '',
            'Protección UV': '',
            'Colores disponibles': '',
            'Forma': '',
            'Edad recomendada': '',
            'Características': ''
        }
    });
    
    const productTypes = [
        'Lentes de contacto',
        'Lentes de sol',
        'Lentes para niños',
        'Monturas',
        'Estuches'
    ];

    // Categorías específicas para cada tipo de producto
    const productCategories = {
        'Lentes de sol': [
            'Aviador',
            'Wayfarer',
            'Deportivo',
            'Oversized',
            'Polarizados',
            'Espejados',
            'Plegables',
            'Cat Eye'
        ],
        'Lentes para niños': [
            'Bebés',
            'Niñas',
            'Niños',
            'Deportivos',
            'Estudio',
            'Protección',
            'Natación'
        ],
        'Lentes de contacto': [
            'Diarios',
            'Quincenales',
            'Mensuales',
            'Tóricos',
            'Multifocales',
            'Cosméticos'
        ],
        'Monturas': [
            'Metálicas',
            'Acetato',
            'Mixtas',
            'Sin marco',
            'Flexibles',
            'Diseñador'
        ],
        'Estuches': [
            'Cuero',
            'Plegable',
            'Aluminio',
            'Deportivo',
            'Vintage',
            'Lujo',
            'Madera',
            'Rígido'
        ]
    };

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
            
            const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!validImageTypes.includes(file.type)) {
                throw new Error('Formatos soportados: JPEG, PNG o WEBP');
            }
            
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('El tamaño máximo permitido es 5MB');
            }

            // Simular progreso de carga
            const interval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const imageUrl = await uploadImage(file);
            clearInterval(interval);
            
            if (!imageUrl?.startsWith('http')) {
                throw new Error('No se pudo obtener una URL válida para la imagen');
            }

            setProduct(prev => ({ ...prev, imageSrc: imageUrl }));
            setUploadProgress(100);
            
        } catch (error) {
            console.error('Error al subir imagen:', error);
            setUploadProgress(0);
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones básicas
        if (!product.imageSrc) {
            alert('Debes subir una imagen del producto');
            return;
        }

        if (isNaN(product.price) || parseFloat(product.price) <= 0) {
            alert('Ingresa un precio válido mayor a cero');
            return;
        }

        // Validación de categoría para productos que lo requieren
        const requiresCategory = ['Lentes de sol', 'Lentes para niños', 'Lentes de contacto', 'Monturas', 'Estuches'];
        if (requiresCategory.includes(product.type) && !product.category) {
            alert(`Por favor selecciona una categoría para ${product.type}`);
            return;
        }

        setIsSubmitting(true);

        try {
            // Estructura base del producto
            const productData = {
                name: product.name.trim(),
                imageSrc: product.imageSrc,
                price: parseFloat(product.price),
                description: product.description.trim(),
                type: product.type,
                details: product.details,
                createdAt: new Date(),
                updatedAt: new Date(),
                active: true, // Por defecto activo
                stock: 0 // Inicialmente sin stock
            };

            // Campos específicos según tipo de producto
            if (product.category) {
                productData.category = product.category;
                
                // Para lentes de sol, la categoría también va en detalles.Estilo
                if (product.type === 'Lentes de sol') {
                    productData.details.Estilo = product.category;
                }
                
                // Para lentes infantiles, ajustamos detalles según categoría
                if (product.type === 'Lentes para niños') {
                    if (product.category === 'Bebés') {
                        productData.details['Edad recomendada'] = '0-3 años';
                    }
                    if (product.category === 'Natación') {
                        productData.details.Características = 'Resistente al agua';
                    }
                }
            }

            // Guardar en Firestore
            const docRef = await addDoc(collection(db, "products"), productData);
            
            console.log("Producto guardado con ID: ", docRef.id);
            setSuccessMessage('¡Producto guardado exitosamente!');
            
            // Resetear formulario después de 3 segundos
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
                        'Forma': '',
                        'Edad recomendada': '',
                        'Características': ''
                    }
                });
                setUploadProgress(0);
            }, 3000);
            
        } catch (error) {
            console.error('Error al guardar producto:', error);
            alert(`Error al guardar: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Determinar si mostrar el selector de categoría
    const shouldShowCategory = product.type && productCategories[product.type];

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
                        maxLength="100"
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

                {/* Selector de categoría (solo para tipos que lo requieren) */}
                {shouldShowCategory && (
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="category">
                            Categoría de {product.type}
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
                            {productCategories[product.type].map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Campo para subir imagen */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Imagen del Producto
                    </label>
                    <div className={styles.fileInputWrapper} onClick={triggerFileInput}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/jpeg, image/png, image/webp"
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
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/images/placeholder-product.jpg';
                                }}
                            />
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
                        min="0.01"
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
                        maxLength="500"
                    />
                </div>

                <div className={styles.formGroup}>
                    <h2 className={styles.detailsTitle}>Detalles del Producto</h2>
                    
                    <div className={styles.detailsGrid}>
                        {Object.entries(product.details).map(([key, value]) => (
                            product.type === 'Lentes para niños' && key === 'Estilo' ? null : (
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
                                        required={key === 'Material' || key === 'Protección UV'}
                                    />
                                </div>
                            )
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
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