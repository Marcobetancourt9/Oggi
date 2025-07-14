import React, { useEffect, useState } from "react";
import { db } from "../../credentials.js";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
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

  const clinicBranches = [
    { id: 1, name: 'Sede Principal - Centro Médico', address: 'Av. Principal, Torre Médica, Piso 3', hours: 'Lun-Vie: 8am-6pm' },
    { id: 2, name: 'Sede Norte - Plaza Comercial', address: 'CC Plaza Norte, Nivel L1', hours: 'Lun-Sab: 9am-7pm' },
    { id: 3, name: 'Sede Este - Urbanización', address: 'Calle 2 con Av. 5, Residencias Vista Bella', hours: 'Mar-Dom: 8am-5pm' }
  ];

  const paymentMethods = [
    { id: 1, name: 'Efectivo', icon: <FaCreditCard /> },
    { id: 2, name: 'Transferencia Bancaria', icon: <FaCreditCard /> },
    { id: 3, name: 'Tarjeta de Crédito/Débito', icon: <FaCreditCard /> },
    { id: 4, name: 'Seguro Médico', icon: <FaCreditCard /> }
  ];

  const availableTimes = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", 
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
  ];

  const fetchCart = async (currentUser) => {
    if (!currentUser) return;

    try {
      const cartRef = collection(db, "cart");
      const q = query(cartRef, where("uid", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);

      const items = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        price: Number(doc.data().price),
        quantity: Number(doc.data().quantity),
      }));

      setCart(items);
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userData = {
          uid: currentUser.uid,
          email: currentUser.email || 'No proporcionado',
          displayName: currentUser.displayName || 'No proporcionado'
        };
        setUser(userData);
        fetchCart(userData);
        setPatientName(userData.displayName);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p>Cargando tu información...</p>
    </div>
  );

  const addToCartAndUpdate = async (product) => {
    try {
      await addDoc(collection(db, "cart"), {
        ...product,
        uid: user.uid,
        createdAt: new Date()
      });
      await fetchCart(user);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  const deleteFromCart = async (itemId) => {
    try {
      await deleteDoc(doc(db, "cart", itemId));
      await fetchCart(user);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const deleteAllFromCart = async () => {
    try {
      if (cart.length === 0) return;
      const batch = writeBatch(db);
      cart.forEach((item) => {
        const itemRef = doc(db, "cart", item.id);
        batch.delete(itemRef);
      });
      await batch.commit();
      await fetchCart(user);
    } catch (error) {
      console.error("Error al eliminar todos los productos:", error);
    }
  };

  const calculateSubtotal = () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const calculateTotal = () => calculateSubtotal();

  const generarMensajeWhatsApp = () => {
    let mensaje = "Hola, quiero confirmar mi compra en la óptica:\n\n";
    mensaje += `Información del paciente:\nNombre: ${patientName}\nEdad: ${patientAge || 'No especificada'}\nEmail: ${user?.email || 'No proporcionado'}\n\n`;
    mensaje += "Productos seleccionados:\n";
    cart.forEach((item) => {
      mensaje += `${item.quantity} x ${item.name} ($${item.price.toFixed(2)}) = $${(item.quantity * item.price).toFixed(2)}\n`;
      if (item.details) mensaje += `Detalles: ${item.details}\n`;
    });
    mensaje += `\nInformación de la cita:\nSucursal: ${selectedBranch?.name || 'No seleccionada'}\nDirección: ${selectedBranch?.address || 'No seleccionada'}\n`;
    mensaje += `Fecha: ${appointmentDate || 'No seleccionada'}\nHora: ${appointmentTime || 'No seleccionada'}\n`;
    mensaje += `\nResumen de pago:\nTotal: $${calculateTotal().toFixed(2)}\nMétodo de pago: ${paymentMethod || 'No seleccionado'}\n`;
    mensaje += `Receta médica requerida: ${prescriptionRequired ? 'Sí' : 'No'}\n`;
    return mensaje;
  };

  const handleWhatsAppClick = async () => {
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
      await addDoc(collection(db, 'ordenes'), {
        paciente: patientName,
        edad: patientAge,
        userEmail: user?.email || 'No proporcionado',
        productos: cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          details: item.details || null
        })),
        sucursal: selectedBranch.name,
        direccion: selectedBranch.address,
        fechaCita: appointmentDate,
        horaCita: appointmentTime,
        metodoPago: paymentMethod,
        recetaRequerida: prescriptionRequired,
        total: calculateTotal(),
        fechaOrden: new Date(),
        estado: 'pendiente'
      });

      const mensaje = generarMensajeWhatsApp();
      const phoneNumber = "584241234567";
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(mensaje)}`, "_blank");

    } catch (error) {
      console.error('Error al guardar la orden:', error);
      alert('❌ Ocurrió un error al procesar tu orden. Por favor intenta nuevamente.');
    }
  };

  return (
    <div className={styles.compraContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}><FaEye /> Óptica Visión Clara</h1>
        <p className={styles.subtitle}>Confirma tu pedido y agenda tu cita</p>
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
          <div className={styles.cartSection}>
            <h3 className={styles.sectionHeader}>Productos Seleccionados</h3>
            <ul className={styles.cartList}>
              {cart.map((item, index) => (
                <li key={`${item.id}-${index}`} className={styles.cartItem}>
                  <div className={styles.itemHeader}>
                    <span className={styles.itemName}>
                      <FaEye className={styles.itemIcon} /> 
                      {item.quantity} x {item.name}
                    </span>
                    <span className={styles.itemPrice}>${(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                  {item.details && <div className={styles.itemDetails}>Especificaciones: ${item.details}</div>}
                  <button 
                    className={styles.deleteButton} 
                    onClick={() => deleteFromCart(item.id)}
                  >
                    <FaTrash /> Eliminar
                  </button>
                </li>
              ))}
            </ul>
            <button className={styles.clearButton} onClick={deleteAllFromCart}>
              <FaTrash /> Vaciar Carrito
            </button>
          </div>

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
              {!paymentMethod && (
                <p className={styles.validationMessage}>Por favor selecciona un método de pago</p>
              )}
            </div>
          </div>

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