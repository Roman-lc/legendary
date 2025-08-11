// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Aca van los datos de configuración de tu proyecto de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBlOmS7UbyV-66JRCInmI-bo8lgLS_-v68",
  authDomain: "legen-dario.firebaseapp.com",
  projectId: "legen-dario",
  storageBucket: "legen-dario.firebasestorage.app",
  messagingSenderId: "996721179350",
  appId: "1:996721179350:web:d5f49f60813fe93aa52777"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

// Exportá db para usarla en otros archivos
export { db };
