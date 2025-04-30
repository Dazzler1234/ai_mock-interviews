// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4EpWcgf7ldggRa8-3p0Evf9d7UyS-TCc",
  authDomain: "prepwise-63ec2.firebaseapp.com",
  projectId: "prepwise-63ec2",
  storageBucket: "prepwise-63ec2.firebasestorage.app",
  messagingSenderId: "554883765345",
  appId: "1:554883765345:web:aa05bba7793649fa958620",
  measurementId: "G-S5N9DPZ473"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);