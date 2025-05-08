import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, update, remove } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBm6iMm6gMBSqwQrHyWPIt0MpBqvB-Mt5o",
  authDomain: "auto-astral-frontend.firebaseapp.com",
  projectId: "auto-astral-frontend",
  storageBucket: "auto-astral-frontend.appspot.com",
  messagingSenderId: "827832154065",
  databaseURL: "https://auto-astral-frontend-default-rtdb.europe-west1.firebasedatabase.app",
  appId: "1:827832154065:web:564e56d6b7057719fa92f0"
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