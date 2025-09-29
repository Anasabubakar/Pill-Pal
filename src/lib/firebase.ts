// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "studio-8233736913-ba743",
  appId: "1:37380026869:web:b6b2c3a526dc319126b0bc",
  apiKey: "AIzaSyD0H9UcdKxd5tFCh247ZfNHDK12Os8f0qE",
  authDomain: "studio-8233736913-ba743.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "37380026869",
  storageBucket: "studio-8233736913-ba743.appspot.com",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);

export { app, storage };
