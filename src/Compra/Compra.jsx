import React, { useEffect, useState } from "react";
import { db } from "../../credentials.js";
import { collection, getDocs, query, where, deleteDoc, doc, writeBatch, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import styles from "./Compra.module.css";
import { FaEye, FaTrash, FaWhatsapp, FaMapMarkerAlt, FaCreditCard, FaUser, FaCalendarAlt } from "react-icons/fa";

const Compra = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);
  const auth = getAuth();

  // Datos de sucursales
  const clinicBranches = [
    { id: 1, name: 'Sede Principal - Centro Médico', address: 'Av. Principal, Torre Médica, Piso 3', hours: 'Lun-Vie: 8am-6pm' },
    { id: 2, name: 'Sede Norte - Plaza Comercial', address: 'CC Plaza Norte, Nivel L1', hours: 'Lun-Sab: 9am-7pm' },
    { id: 3, name: 'Sede Este - Urbanización', address: 'Calle 2 con Av. 5, Residencias Vista Bella', hours: 'Mar-Dom: 8am-5pm' }
  ];

  // Métodos de pago
  const paymentMethods = [
    { id: 1, name: 'Efectivo', icon: <FaCreditCard /> },
    { id: 2, name: 'Transferencia Bancaria', icon: <FaCreditCard /> },
    { id: 3, name: 'Tarjeta de Crédito/Débito', icon: <FaCreditCard /> },
    { id: 4, name: 'Seguro Médico', icon: <FaCreditCard /> }
  ];

  // Horarios disponibles
  const availableTimes = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", 
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
  ];

  // Cargar carrito del usuario
  const fetchUserCart = async (userId) => {
    try {
      const cartRef = collection(db, "cart");
      const q = query(cartRef, where("uid", "==", userId));
      const querySnapshot = await getDocs(q);

      const userCart = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        price: Number(doc.data().price),
        quantity: Number(doc.data().quantity)
      }));

      setCart(userCart);
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
    }
  };

  // Verificar estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName
        });
        setPatientName(currentUser.displayName || "");
        fetchUserCart(currentUser.uid);
      } else {
        navigate('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Eliminar producto del carrito
  const deleteFromCart = async (itemId) => {
    try {
      await deleteDoc(doc(db, "cart", itemId));
      fetchUserCart(user.uid);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Ocurrió un error al eliminar el producto");
    }
  };

  // Vaciar carrito completo
  const deleteAllFromCart = async () => {
    try {
      if (cart.length === 0) return;
      
      const batch = writeBatch(db);
      cart.forEach((item) => {
        const itemRef = doc(db, "cart", item.id);
        batch.delete(itemRef);
      });
      
      await batch.commit();
      fetchUserCart(user.uid);
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      alert("Ocurrió un error al vaciar el carrito");
    }
  };

  // Calcular subtotal
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calcular total (incluye consulta si es necesario)
  const calculateTotal = () => {
    let total = calculateSubtotal();
    if (prescriptionRequired) total += 50; // Costo de consulta
    return total;
  };

  // Generar mensaje para WhatsApp
  const generarMensajeWhatsApp = () => {
    let mensaje = `Hola, quiero confirmar mi compra en Óptica Oggi:\n\n`;
    mensaje += `*Información del paciente:*\n`;
    mensaje += `Nombre: ${patientName}\n`;
    mensaje += `Edad: ${patientAge || 'No especificada'}\n`;
    mensaje += `Email: ${user?.email || 'No proporcionado'}\n\n`;
    
    mensaje += `*Productos seleccionados:*\n`;
    cart.forEach((item) => {
      mensaje += `- ${item.quantity} x ${item.name} ($${item.price.toFixed(2)})\n`;
      if (item.details) {
        Object.entries(item.details).forEach(([key, value]) => {
          mensaje += `  ${key}: ${value}\n`;
        });
      }
    });
    
    mensaje += `\n*Información de la cita:*\n`;
    mensaje += `Sucursal: ${selectedBranch?.name || 'No seleccionada'}\n`;
    mensaje += `Dirección: ${selectedBranch?.address || 'No seleccionada'}\n`;
    mensaje += `Fecha: ${appointmentDate || 'No seleccionada'}\n`;
    mensaje += `Hora: ${appointmentTime || 'No seleccionada'}\n\n`;
    
    mensaje += `*Resumen de pago:*\n`;
    mensaje += `Subtotal: $${calculateSubtotal().toFixed(2)}\n`;
    if (prescriptionRequired) {
      mensaje += `Consulta oftalmológica: $50.00\n`;
    }
    mensaje += `TOTAL: $${calculateTotal().toFixed(2)}\n`;
    mensaje += `Método de pago: ${paymentMethod || 'No seleccionado'}\n`;
    mensaje += `Receta médica requerida: ${prescriptionRequired ? 'Sí' : 'No'}`;

    return encodeURIComponent(mensaje);
  };

  // Confirmar compra por WhatsApp
  const handleWhatsAppClick = async () => {
    // Validaciones
    if (cart.length === 0) {
      alert("🛒 Tu carrito está vacío. Por favor agrega productos antes de continuar.");
      return;
    }

    if (!selectedBranch) {
      alert("🏥 Por favor selecciona una sucursal para tu cita.");
      return;
    }

    if (!paymentMethod) {
      alert("💳 Por favor selecciona un método de pago.");
      return;
    }

    if (!appointmentDate || !appointmentTime) {
      alert("📅 Por favor selecciona fecha y hora para tu cita.");
      return;
    }

    if (!patientName) {
      alert("👤 Por favor ingresa el nombre del paciente.");
      return;
    }

    try {
      // Guardar la orden en Firestore
      await addDoc(collection(db, 'orders'), {
        patient: {
          name: patientName,
          age: patientAge,
          email: user.email
        },
        products: cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          details: item.details
        })),
        branch: {
          id: selectedBranch.id,
          name: selectedBranch.name,
          address: selectedBranch.address
        },
        appointment: {
          date: appointmentDate,
          time: appointmentTime
        },
        payment: {
          method: paymentMethod,
          total: calculateTotal()
        },
        prescriptionRequired,
        status: 'pending',
        createdAt: new Date(),
        userId: user.uid
      });

      // Vaciar el carrito después de confirmar
      await deleteAllFromCart();

      // Abrir WhatsApp con el mensaje
      const phoneNumber = "584241234567"; // Reemplaza con tu número
      window.open(`https://wa.me/${phoneNumber}?text=${generarMensajeWhatsApp()}`, "_blank");

    } catch (error) {
      console.error('Error al confirmar la orden:', error);
      alert('❌ Ocurrió un error al procesar tu orden. Por favor intenta nuevamente.');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando tu carrito...</p>
      </div>
    );
  }

  return (
    <div className={styles.compraContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}><FaEye /> Óptica Oggi</h1>
        <p className={styles.subtitle}>Finaliza tu compra</p>
      </div>

      {cart.length === 0 ? (
        <div className={styles.emptyCart}>
          <div className={styles.emptyIllustration}>
            <FaEye size={60} />
            <p className={styles.emptyMessage}>Tu carrito de compras está vacío</p>
          </div>
          <button 
            className={styles.continueShopping}
            onClick={() => navigate('/productos')}
          >
            Ver Productos
          </button>
        </div>
      ) : (
        <div className={styles.cartContent}>
          {/* Sección de productos */}
          <div className={styles.cartSection}>
            <h3 className={styles.sectionHeader}>Tus Productos</h3>
            <div className={styles.cartList}>
              {cart.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className={styles.itemDetails}>
                    <h4>{item.name}</h4>
                    <p className={styles.itemDescription}>{item.description}</p>
                    <div className={styles.itemSpecs}>
                      {Object.entries(item.details || {}).map(([key, value]) => (
                        <div key={key} className={styles.specItem}>
                          <span className={styles.specLabel}>{key}:</span>
                          <span className={styles.specValue}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                    <span className={styles.itemQuantity}>Cantidad: {item.quantity}</span>
                    <button 
                      onClick={() => deleteFromCart(item.id)}
                      className={styles.deleteButton}
                    >
                      <FaTrash /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.cartSummary}>
              <div className={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <button 
                onClick={deleteAllFromCart}
                className={styles.clearButton}
              >
                <FaTrash /> Vaciar Carrito
              </button>
            </div>
          </div>

          {/* Sección del formulario */}
          <div className={styles.formSection}>
            <div className={styles.formGroup}>
              <h3 className={styles.sectionHeader}><FaUser /> Información del Paciente</h3>
              <div className={styles.inputGroup}>
                <label>Nombre Completo</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Nombre del paciente"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Edad (Opcional)</label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="Edad del paciente"
                  min="1"
                  max="120"
                />
              </div>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="prescriptionRequired"
                  checked={prescriptionRequired}
                  onChange={(e) => setPrescriptionRequired(e.target.checked)}
                />
                <label htmlFor="prescriptionRequired">Requiero receta médica</label>
              </div>
            </div>

            <div className={styles.formGroup}>
              <h3 className={styles.sectionHeader}><FaMapMarkerAlt /> Sucursal de Preferencia</h3>
              <select
                className={styles.formSelect}
                value={selectedBranch?.id || ''}
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value);
                  const branch = clinicBranches.find(b => b.id === selectedId);
                  setSelectedBranch(branch);
                }}
                required
              >
                <option value="">Selecciona una sucursal</option>
                {clinicBranches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} - {branch.address}
                  </option>
                ))}
              </select>
              {selectedBranch && (
                <div className={styles.branchInfo}>
                  <p><strong>Dirección:</strong> {selectedBranch.address}</p>
                  <p><strong>Horario:</strong> {selectedBranch.hours}</p>
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <h3 className={styles.sectionHeader}><FaCalendarAlt /> Fecha y Hora de Cita</h3>
              <div className={styles.datetimeGroup}>
                <div className={styles.inputGroup}>
                  <label>Fecha</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Hora</label>
                  <select
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    required
                  >
                    <option value="">Selecciona una hora</option>
                    {availableTimes.map((time, index) => (
                      <option key={index} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <h3 className={styles.sectionHeader}><FaCreditCard /> Método de Pago</h3>
              <div className={styles.paymentMethods}>
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id} 
                    className={`${styles.paymentMethod} ${paymentMethod === method.name ? styles.selected : ''}`}
                    onClick={() => setPaymentMethod(method.name)}
                  >
                    <div className={styles.paymentIcon}>{method.icon}</div>
                    <div className={styles.paymentName}>{method.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen de la orden */}
          <div className={styles.summarySection}>
            <h3 className={styles.sectionHeader}>Resumen de la Orden</h3>
            <div className={styles.summaryContent}>
              <div className={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              
              {prescriptionRequired && (
                <div className={styles.summaryRow}>
                  <span>Consulta oftalmológica:</span>
                  <span>$50.00</span>
                </div>
              )}
              
              <div className={styles.totalRow}>
                <span>TOTAL:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <button 
              className={styles.confirmButton} 
              onClick={handleWhatsAppClick}
              disabled={!selectedBranch || !paymentMethod || !appointmentDate || !appointmentTime || !patientName}
            >
              <FaWhatsapp /> Confirmar Orden por WhatsApp
            </button>

            <div className={styles.notes}>
              <p><strong>Nota importante:</strong> Para lentes recetados, por favor traer tu receta médica actualizada al momento de tu cita.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compra;