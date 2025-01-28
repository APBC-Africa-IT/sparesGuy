// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider  } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export {auth};