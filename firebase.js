
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUGNlKSwvZOeIckEkM1yZKCwS50txD2U",
  authDomain: "kufur-clinic.firebaseapp.com",
  projectId: "kufur-clinic",
  storageBucket: "kufur-clinic.appspot.com",
  messagingSenderId: "753660512139",
  appId: "1:753660512139:web:9a4e799d6ae9831f46118e",
  measurementId: "G-PX94SLKPF6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
