import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD4aqMXxuRrAX9sVHeGfgXYxQag7OgBJ9k",
  authDomain: "reactchat-15e19.firebaseapp.com",
  projectId: "reactchat-15e19",
  storageBucket: "reactchat-15e19.firebasestorage.app",
  messagingSenderId: "42592841091",
  appId: "1:42592841091:web:e9ca35c12531b279a59ab6",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)