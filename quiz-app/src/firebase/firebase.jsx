import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBAjjC-ndCseM2Satcc6dnj6ncil9ZWruw",
  authDomain: "quizapp-11dff.firebaseapp.com",
  projectId: "quizapp-11dff",
  storageBucket: "quizapp-11dff.firebasestorage.app",
  messagingSenderId: "382657779570",
  appId: "1:382657779570:web:9435514e3e2c416c89efeb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// Export both db and auth
export { db, auth };

console.log("🔥 Firebase initialized");
