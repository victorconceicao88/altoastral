import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, update, remove } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDoJsFDDqE6jzXiif877rlSqdsycgUES-Y",
  authDomain: "auto-astral-68e12.firebaseapp.com",
  databaseURL: "https://auto-astral-68e12-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "auto-astral-68e12",
  storageBucket: "auto-astral-68e12.appspot.com",  // corrigido
  messagingSenderId: "142521496096",
  appId: "1:142521496096:web:e8b8c811aea216a38d4245"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Função para login anônimo
export const loginAnonimo = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error("Erro no login anônimo:", error);
    throw error;
  }
};

export { 
  database, 
  ref, 
  push, 
  onValue, 
  update, 
  remove, 
  auth,
  getDatabase,
};