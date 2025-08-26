// Firebase config + app export
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyABml0jStOVhD1MRZKIzqlvikvKdWAAt5M",
  authDomain: "todos-dd696.firebaseapp.com",
  projectId: "todos-dd696",
  storageBucket: "todos-dd696.firebasestorage.app",
  messagingSenderId: "694859348011",
  appId: "1:694859348011:web:9b15349204df308309526e",
  measurementId: "G-902JV2C2KS"
};

export const app = initializeApp(firebaseConfig);
