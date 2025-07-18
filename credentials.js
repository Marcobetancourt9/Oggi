import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCm4GaY9bMlY3oiIPGqYgX9oggpT5sABCI",
  authDomain: "oggi-61441.firebaseapp.com",
  projectId: "oggi-61441",
  storageBucket: "oggi-61441.appspot.com", // Cambié esto (usa appspot.com en lugar de firebasestorage.app)
  messagingSenderId: "155014598357",
  appId: "1:155014598357:web:7f931f68d27718114adc5c",
  measurementId: "G-YD533LCBPQ"
};

let app, analytics, db, auth;

try {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  db = getFirestore(app);
  auth = getAuth(app);
  console.log("Firebase inicializado correctamente");
} catch (error) {
  console.error("Error al inicializar Firebase:", error);
}

export { app, analytics, db, auth };