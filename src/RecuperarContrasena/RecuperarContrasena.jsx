"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RecuperarContrasena.module.css";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "../../credentials";
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

const auth = getAuth(app);

function RecuperarContrasena() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Por favor ingresa tu correo electrónico");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ingresa un correo electrónico válido");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (error) {
      console.error("Error al enviar email de recuperación:", error);
      if (error.code === "auth/user-not-found") {
        setError("No existe una cuenta con este correo electrónico");
      } else {
        setError("Ocurrió un error al enviar el email de recuperación");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button 
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft /> Volver
        </button>

        <div className={styles.logoContainer}>
          <img 
            src="../public/oggi.png" 
            alt="Óptica Oggi" 
            className={styles.logo}
          />
          <h1 className={styles.title}>Recuperar Contraseña</h1>
          <p className={styles.subtitle}>
            {success 
              ? "Revisa tu correo electrónico para restablecer tu contraseña" 
              : "Ingresa tu correo electrónico para recibir instrucciones"}
          </p>
        </div>

        {success ? (
          <div className={styles.successMessage}>
            <FaCheckCircle className={styles.successIcon} />
            <p>Hemos enviado un enlace de recuperación a <strong>{email}</strong></p>
            <p>Si no lo ves en tu bandeja de entrada, revisa la carpeta de spam.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.inputGroup}>
              <FaEnvelope className={styles.inputIcon} />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
                required
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.spinner}></span>
              ) : (
                "Enviar Instrucciones"
              )}
            </button>
          </form>
        )}

        <div className={styles.footer}>
          <p>¿Necesitas ayuda? <a href="/contacto">Contáctanos</a></p>
          <p className={styles.copyright}>© {new Date().getFullYear()} Óptica Oggi</p>
        </div>
      </div>
    </div>
  );
}

export default RecuperarContrasena;