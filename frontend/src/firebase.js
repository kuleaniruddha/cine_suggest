import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForInitializationCheck12345",
  projectId: "cine-suggest-7787c",
  authDomain: "cine-suggest-7787c.firebaseapp.com",
  storageBucket: "cine-suggest-7787c.appspot.com",
  messagingSenderId: "110771316689246234361",
  appId: "1:110771316689246234361:web:cinesuggestapp"
};

let app = null;
let auth = null;
let googleProvider = null;
let isFirebaseReady = false;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
  isFirebaseReady = true;
} catch (e) {
  console.warn('Firebase client initialization warning:', e.message);
}

// Safe wrapper for onAuthStateChanged
const safeOnAuthStateChanged = (authInstance, callback) => {
  if (!authInstance) return () => {};
  try {
    return onAuthStateChanged(authInstance, callback);
  } catch (err) {
    console.warn('onAuthStateChanged notice:', err.message);
    return () => {};
  }
};

export {
  app,
  auth,
  googleProvider,
  isFirebaseReady,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  safeOnAuthStateChanged as onAuthStateChanged
};
