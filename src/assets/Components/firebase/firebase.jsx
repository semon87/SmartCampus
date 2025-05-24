// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAbf0JLkUu56jGJ8TMHGqP863_5n-FsTk",
  authDomain: "smart-order-bc553.firebaseapp.com",
  projectId: "smart-order-bc553",
  storageBucket: "smart-order-bc553.firebasestorage.app",
  messagingSenderId: "801557187013",
  appId: "1:801557187013:web:c996cc0bded3815fa7e3ac",
  measurementId: "G-LR21JRSBKQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Get auth instance
const auth = getAuth(app);

// Create Google provider instance
const googleProvider = new GoogleAuthProvider();

// Export what you'll need
export { auth, googleProvider };
export default app;