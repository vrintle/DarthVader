// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "darth-vader-bd7b2.firebaseapp.com",
  projectId: "darth-vader-bd7b2",
  storageBucket: "darth-vader-bd7b2.appspot.com",
  messagingSenderId: "14534847261",
  appId: "1:14534847261:web:f72c9bc11f045d397bcff4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
