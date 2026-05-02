// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAzfcwRBTa15OGlh-MRDsDEb95r-5yPNkc",
  authDomain: "sves1-fb6a2.firebaseapp.com",
  projectId: "sves1-fb6a2",
  storageBucket: "sves1-fb6a2.firebasestorage.app",
  messagingSenderId: "966758504497",
  appId: "1:966758504497:web:1a04321ffccd86d50ddd10",
  measurementId: "G-4625MY53PQ"
};

const app = initializeApp(firebaseConfig);

// 🔥 IMPORTANT
export const auth = getAuth(app);
export { auth };