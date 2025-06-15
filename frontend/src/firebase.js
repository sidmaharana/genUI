// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdSaGEO2_AwcIDVSJlXpA_YQgSGxsWRsE",
  authDomain: "genui-52c40.firebaseapp.com",
  projectId: "genui-52c40",
  storageBucket: "genui-52c40.firebasestorage.app",
  messagingSenderId: "111200967901",
  appId: "1:111200967901:web:0a8aa6f2d27868eb6e8f34"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Add providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Export everything
export { auth, db, googleProvider, githubProvider };
export default app;
