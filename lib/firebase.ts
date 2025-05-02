// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAo6PrdDF8rfvAev3VndutzWiYpXsu7HQs",
  authDomain: "cracked-math.firebaseapp.com",
  projectId: "cracked-math",
  storageBucket: "cracked-math.firebasestorage.app",
  messagingSenderId: "357562349916",
  appId: "1:357562349916:web:b63650501015bdc90b2999",
  measurementId: "G-46VV6RKVNM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

let analytics; // Declare with the imported type and allow undefined
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics }; // Export the potentially undefined analytics
export default app
