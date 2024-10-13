// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgVSHAXNMXh0AQ-zU0aO8j9EEI6fqnPes",
  authDomain: "wanderlust-39a59.firebaseapp.com",
  projectId: "wanderlust-39a59",
  storageBucket: "wanderlust-39a59.appspot.com",
  messagingSenderId: "621425940616",
  appId: "1:621425940616:web:3ba6d4234df13f1e52673d",
  measurementId: "G-K8RT2H324Q"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);

const analytics = getAnalytics(app);