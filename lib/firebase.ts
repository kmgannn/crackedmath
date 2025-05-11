// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signInWithPopup,
  signInWithRedirect
} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
//import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCK0fXeDjPNZpu9cppuaObnnO7nM8Z3c18",
  authDomain: "crackedmath.firebaseapp.com",
  projectId: "crackedmath",
  storageBucket: "crackedmath.firebasestorage.app",
  messagingSenderId: "69825752977",
  appId: "1:69825752977:web:84a36a0d8817093262b430",
  measurementId: "G-2168PX1759"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    return { success: false, error };
  }
};

export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Error signing in with Facebook:", error);
    return { success: false, error };
  }
};

let analytics; // Declare with the imported type and allow undefined
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics }; // Export the potentially undefined analytics
export default app


