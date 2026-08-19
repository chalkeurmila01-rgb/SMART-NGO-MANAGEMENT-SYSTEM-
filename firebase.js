import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDaYYfSVv657fYx2EAvqaPTrhmsVXEV1yA",
  authDomain: "ai-ngo-management-system.firebaseapp.com",
  projectId: "ai-ngo-management-system",
  storageBucket: "ai-ngo-management-system.firebasestorage.app",
  messagingSenderId: "395267054824",
  appId: "1:395267054824:web:4ff4bc438716a66c2f3d5d",
  measurementId: "G-MMTH4P0E77"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };