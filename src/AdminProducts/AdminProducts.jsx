import React, { useState, useEffect } from 'react';
import { db, auth } from '../../credentials';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import styles from './AdminProducts.module.css';
import { FiTrash2, FiEdit, FiSearch, FiX, FiSave, FiArrowLeft, FiLogOut } from 'react-icons/fi';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

// Lista de correos autorizados (completa los espacios vacíos)
const AUTHORIZED_EMAILS = [
  'marco.betancourt@correo.unimet.edu.ve',
  '', // Completa con el segundo correo
  ''  // Completa con el tercer correo
];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    type: '',
    category: '',
    price: '',
    description: '',
    imageSrc: ''
  });
  const [user, setUser] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  // Verificar autenticación y autorización
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (AUTHORIZED_EMAILS.includes(currentUser.email)) {
          setUser(currentUser);
          setAccessDenied(false);
          fetchProducts();
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

  // Obtener productos
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setProducts(productsData);
      setFilteredProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products: ", error);
      toast.error('Error al cargar los productos');
      setLoading(false);
    }
  };

  // Filtrar productos
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.type.toLowerCase().includes(term) ||
          (product.category && product.category.toLowerCase().includes(term)) ||
          (product.description && product.description.toLowerCase().includes(term))
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // Modal de eliminación
  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Funciones de edición
  const startEditing = (product) => {
    setEditingProduct(product.id);
    setEditFormData({
      name: product.name,
      type: product.type,
      category: product.category || '',
      price: product.price?.toString() || '',
      description: product.description || '',
      imageSrc: product.imageSrc || ''
    });
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setEditFormData({
      name: '',
      type: '',
      category: '',
      price: '',
      description: '',
      imageSrc: ''
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveEditedProduct = async (productId) => {
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, {
        name: editFormData.name,
        type: editFormData.type,
        category: editFormData.category,
        price: parseFloat(editFormData.price) || 0,
        description: editFormData.description,
        imageSrc: editFormData.imageSrc
      });

      const updatedProducts = products.map(p => 
        p.id === productId ? { ...p, ...editFormData, price: parseFloat(editFormData.price) || 0 } : p
      );
      
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setEditingProduct(null);
      toast.success('Producto actualizado correctamente');
    } catch (error) {
      console.error("Error updating product: ", error);
      toast.error('Error al actualizar el producto');
    }
  };

  // Eliminar producto
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteDoc(doc(db, "products", productToDelete.id));
      
      const updatedProducts = products.filter(p => p.id !== productToDelete.id);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      
      toast.success(`"${productToDelete.name}" eliminado correctamente`);
    } catch (error) {
      console.error("Error deleting product: ", error);
      toast.error('Error al eliminar el producto');
    } finally {
      closeDeleteModal();
    }
  };

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
      toast.error('Error al cerrar sesión');
    }
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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando productos...</p>
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
        <button onClick={handleLogout} className={styles.logoutButton}>
          <FiLogOut /> Cerrar sesión
        </button>
      </div>

      <h1 className={styles.adminTitle}>Administración de Productos</h1>
      <p className={styles.adminSubtitle}>Gestiona todos los productos de tu óptica</p>

      {/* Barra de búsqueda */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar productos por nombre, tipo o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className={styles.clearSearchButton}
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      {/* Tabla de productos */}
      <div className={styles.productsTableContainer}>
        {filteredProducts.length === 0 ? (
          <div className={styles.noProducts}>
            {searchTerm 
              ? 'No se encontraron productos que coincidan con tu búsqueda' 
              : 'No hay productos registrados'}
          </div>
        ) : (
          <table className={styles.productsTable}>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.imageSrc && (
                      <img 
                        src={editingProduct === product.id ? editFormData.imageSrc : product.imageSrc} 
                        alt={product.name} 
                        className={styles.productImage}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/placeholder-product.jpg';
                        }}
                      />
                    )}
                  </td>
                  <td>
                    {editingProduct === product.id ? (
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditFormChange}
                        className={styles.editInput}
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td>
                    {editingProduct === product.id ? (
                      <input
                        type="text"
                        name="type"
                        value={editFormData.type}
                        onChange={handleEditFormChange}
                        className={styles.editInput}
                      />
                    ) : (
                      product.type
                    )}
                  </td>
                  <td>
                    {editingProduct === product.id ? (
                      <input
                        type="text"
                        name="category"
                        value={editFormData.category}
                        onChange={handleEditFormChange}
                        className={styles.editInput}
                      />
                    ) : (
                      product.category || '-'
                    )}
                  </td>
                  <td>
                    {editingProduct === product.id ? (
                      <input
                        type="number"
                        name="price"
                        value={editFormData.price}
                        onChange={handleEditFormChange}
                        className={styles.editInput}
                        step="0.01"
                        min="0"
                      />
                    ) : (
                      `$${product.price?.toFixed(2) || '0.00'}`
                    )}
                  </td>
                  <td>
                    <div className={styles.actionsContainer}>
                      {editingProduct === product.id ? (
                        <>
                          <button 
                            className={styles.saveButton}
                            onClick={() => saveEditedProduct(product.id)}
                            title="Guardar"
                          >
                            <FiSave />
                          </button>
                          <button 
                            className={styles.cancelEditButton}
                            onClick={cancelEditing}
                            title="Cancelar"
                          >
                            <FiArrowLeft />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className={styles.editButton}
                            onClick={() => startEditing(product)}
                            title="Editar"
                          >
                            <FiEdit />
                          </button>
                          <button 
                            className={styles.deleteButton}
                            onClick={() => openDeleteModal(product)}
                            title="Eliminar"
                          >
                            <FiTrash2 />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        className={styles.modal}
        overlayClassName={styles.overlay}
        ariaHideApp={false}
      >
        <h2>Confirmar eliminación</h2>
        <p>¿Estás seguro que deseas eliminar el producto "{productToDelete?.name}"?</p>
        <p className={styles.warningText}>Esta acción no se puede deshacer.</p>
        
        <div className={styles.modalButtons}>
          <button 
            onClick={closeDeleteModal}
            className={styles.cancelButton}
          >
            Cancelar
          </button>
          <button 
            onClick={handleDeleteProduct}
            className={styles.confirmDeleteButton}
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProducts;