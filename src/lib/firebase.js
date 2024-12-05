import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-15e19.firebaseapp.com",
  projectId: "reactchat-15e19",
  storageBucket: "reactchat-15e19.firebasestorage.app",
  messagingSenderId: "42592841091",
  appId: "1:42592841091:web:e9ca35c12531b279a59ab6",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()