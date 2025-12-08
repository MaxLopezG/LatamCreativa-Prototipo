// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDQsGnEGghNhJ0nGtUIpjHItJXr8xs-xzw",
    authDomain: "latamcreativa-demo.firebaseapp.com",
    projectId: "latamcreativa-demo",
    storageBucket: "latamcreativa-demo.firebasestorage.app",
    messagingSenderId: "389692827854",
    appId: "1:389692827854:web:d3c98ea1c18155e7db889f",
    measurementId: "G-YMVR204V3L"
};

// Initialize Firebase
import { getStorage } from "firebase/storage";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
