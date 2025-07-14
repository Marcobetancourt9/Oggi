// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage"; // Uncomment if you need Firebase Storage

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCm4GaY9bMlY3oiIPGqYgX9oggpT5sABCI",
  authDomain: "oggi-61441.firebaseapp.com",
  projectId: "oggi-61441",
  storageBucket: "oggi-61441.firebasestorage.app",
  messagingSenderId: "155014598357",
  appId: "1:155014598357:web:7f931f68d27718114adc5c",
  measurementId: "G-YD533LCBPQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };