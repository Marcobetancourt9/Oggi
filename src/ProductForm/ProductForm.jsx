import React, { useState, useRef, useEffect } from 'react';
import { uploadImage } from '../../supabaseCredentials';
import { db, auth } from '../../credentials';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FiLogOut, FiUpload, FiCheckCircle } from 'react-icons/fi';
import styles from './ProductForm.module.css';

// Lista de correos autorizados
const AUTHORIZED_EMAILS = [
  'marco.betancourt@correo.unimet.edu.ve',
  '', // Completa con el segundo correo
  ''  // Completa con el tercer correo
];

const ProductForm = () => {
    const [product, setProduct] = useState({
        name: '',
        imageSrc: '',
        price: '',
        description: '',
        type: '',
        category: '',
        details: {
            'Material': '',
            'Colores disponibles': '',
            'Estilo': '',
            'Protección UV': '',
            'Forma': '',
            'Duración': '',
            'Uso recomendado': '',
            'Tipo de montura': '',
            'Peso': '',
            'Ajuste': ''
        }
    });
    
    const productTypes = [
        'Lentes de contacto',
        'Lentes de sol',
        'Lentes para niños',
        'Monturas',
        'Estuches'
    ];

    const productCategories = {
        'Lentes de sol': ['Aviador', 'Wayfarer', 'Deportivo', 'Oversized', 'Polarizados', 'Espejados', 'Plegables', 'Cat Eye'],
        'Lentes para niños': ['Bebés', 'Niñas', 'Niños', 'Deportivos', 'Estudio', 'Protección', 'Natación'],
        'Lentes de contacto': ['Diarios', 'Quincenales', 'Mensuales', 'Tóricos', 'Multifocales', 'Cosméticos'],
        'Monturas': ['Metálicas', 'Acetato', 'Mixtas', 'Sin marco', 'Flexibles', 'Diseñador'],
        'Estuches': ['Cuero', 'Plegable', 'Aluminio', 'Deportivo', 'Vintage', 'Lujo', 'Madera', 'Rígido']
    };

    const productSpecificFields = {
        'Lentes de sol': ['Estilo', 'Protección UV', 'Forma'],
        'Lentes para niños': ['Edad recomendada', 'Características especiales'],
        'Lentes de contacto': ['Duración', 'Uso recomendado', 'Tipo de lente'],
        'Monturas': ['Tipo de montura', 'Peso', 'Ajuste'],
        'Estuches': ['Capacidad', 'Protección', 'Cierre']
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [user, setUser] = useState(null);
    const [accessDenied, setAccessDenied] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef(null);

    // Verificar autenticación
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                if (AUTHORIZED_EMAILS.includes(currentUser.email)) {
                    setUser(currentUser);
                    setAccessDenied(false);
                } else {
                    setAccessDenied(true);
                    signOut(auth);
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

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
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!product.imageSrc) {
            toast.error('Debes subir una imagen del producto');
            return;
        }

        if (isNaN(product.price) || parseFloat(product.price) <= 0) {
            toast.error('Ingresa un precio válido mayor a cero');
            return;
        }

        const requiresCategory = ['Lentes de sol', 'Lentes para niños', 'Lentes de contacto', 'Monturas', 'Estuches'];
        if (requiresCategory.includes(product.type) && !product.category) {
            toast.error(`Por favor selecciona una categoría para ${product.type}`);
            return;
        }

        setIsSubmitting(true);

        try {
            const productData = {
                name: product.name.trim(),
                imageSrc: product.imageSrc,
                price: parseFloat(product.price),
                description: product.description.trim(),
                type: product.type,
                details: product.details,
                createdAt: new Date(),
                updatedAt: new Date(),
                active: true,
                stock: 0,
                createdBy: user.email
            };

            if (product.category) {
                productData.category = product.category;
            }

            await addDoc(collection(db, "products"), productData);
            
            setSuccessMessage('¡Producto guardado exitosamente!');
            
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
                        'Material': '',
                        'Colores disponibles': '',
                        'Estilo': '',
                        'Protección UV': '',
                        'Forma': '',
                        'Edad recomendada': '',
                        'Características especiales': '',
                        'Duración': '',
                        'Uso recomendado': '',
                        'Tipo de lente': '',
                        'Tipo de montura': '',
                        'Peso': '',
                        'Ajuste': '',
                        'Capacidad': '',
                        'Protección': '',
                        'Cierre': ''
                    }
                });
                setUploadProgress(0);
            }, 3000);
            
        } catch (error) {
            console.error('Error al guardar producto:', error);
            toast.error(`Error al guardar: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success('Sesión cerrada correctamente');
        } catch (error) {
            console.error("Error al cerrar sesión: ", error);
            toast.error('Error al cerrar sesión');
        }
    };

    const getVisibleDetailFields = () => {
        const commonFields = ['Material', 'Colores disponibles'];
        const specificFields = product.type ? productSpecificFields[product.type] || [] : [];
        return [...commonFields, ...specificFields];
    };

    if (accessDenied) {
        return (
            <div className={styles.accessDeniedContainer}>
                <h2>Acceso Denegado</h2>
                <p>No tienes permiso para acceder a esta página.</p>
                <p>Por favor, inicia sesión con una cuenta autorizada.</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Verificando credenciales...</p>
            </div>
        );
    }

    return (
        <div className={styles.adminContainer}>
            {/* Barra superior con información de usuario */}
            <div className={styles.userBar}>
                <div className={styles.userInfo}>
                    <span>Bienvenido, {user.email}</span>
                </div>
            </div>

            <div className={styles.formContainer}>
                <h1 className={styles.title}>Agregar Nuevo Producto</h1>
                
                {successMessage && (
                    <div className={styles.successMessage}>
                        <FiCheckCircle className={styles.successIcon} />
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formRow}>
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
                    </div>

                    {product.type && productCategories[product.type] && (
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
                                required={productCategories.hasOwnProperty(product.type)}
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

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Imagen del Producto
                        </label>
                        <div className={styles.fileInputContainer}>
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
                                    <FiUpload className={styles.uploadIcon} />
                                    {product.imageSrc ? 'Cambiar imagen' : 'Seleccionar archivo (JPEG, PNG, WEBP)'}
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
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="price">
                                Precio
                            </label>
                            <div className={styles.priceInputContainer}>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={product.price}
                                    onChange={handleInputChange}
                                    className={`${styles.input} ${styles.priceInput}`}
                                    step="0.01"
                                    min="0.01"
                                    required
                                />
                            </div>
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
                                rows="3"
                                required
                                maxLength="500"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <h2 className={styles.detailsTitle}>Detalles del Producto</h2>
                        
                        <div className={styles.detailsGrid}>
                            {getVisibleDetailFields().map((field) => (
                                <div key={field} className={styles.detailCard}>
                                    <label className={styles.label} htmlFor={`detail-${field}`}>
                                        {field}
                                    </label>
                                    <input
                                        type="text"
                                        id={`detail-${field}`}
                                        name={field}
                                        value={product.details[field] || ''}
                                        onChange={handleDetailChange}
                                        className={styles.input}
                                        required={['Material', 'Colores disponibles'].includes(field)}
                                    />
                                </div>
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
        </div>
    );
};

export default ProductForm;