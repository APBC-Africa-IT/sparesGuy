import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// Import getAnalytics conditionally
let analytics;

if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics();
  });
}

const firebaseConfig = {
  apiKey: "AIzaSyBNWlpYR1c-lmFYSyaUpJ8k_Sai_XbncGY",
  authDomain: "mysparesguy2.firebaseapp.com",
  projectId: "mysparesguy2",
  storageBucket: "mysparesguy2.firebasestorage.app",
  messagingSenderId: "235384113512",
  appId: "1:235384113512:web:2fa176059fc6340cc8aedd",
  measurementId: "G-S4S04DBZDY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export sign-in function
export const signInWithGoogle = () => signInWithPopup(auth, provider);
export { auth, analytics };
