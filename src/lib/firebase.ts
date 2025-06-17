
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// import { getStorage } from 'firebase/storage'; // Uncomment if you need Firebase Storage
// import { getAnalytics } from "firebase/analytics"; // Uncomment if you need Firebase Analytics

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional, but often included
};

// Initialize Firebase
let app;
if (!getApps().length) {
  // Check if all required Firebase config keys are present
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    console.error("Firebase configuration error: API Key, Auth Domain, or Project ID is missing. Check your .env.local file and ensure it's loaded correctly.");
  }
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);
const auth = getAuth(app);
// const storage = getStorage(app); // Uncomment if you need Firebase Storage
// let analytics; // Uncomment if you need Firebase Analytics
// if (typeof window !== 'undefined') { // Ensure Analytics is only initialized on the client
//   analytics = getAnalytics(app);
// }

export { db, auth /*, storage, analytics */ }; // Add other exports as needed
