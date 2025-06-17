
import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
// import { getStorage } from 'firebase/storage'; // Uncomment if you need Firebase Storage
// import { getAnalytics } from "firebase/analytics"; // Uncomment if you need Firebase Analytics

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, 
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let db: Firestore | null = null; 
let auth: Auth | null = null; 

// Critical Firebase configuration check
if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId
) {
  console.error(
    'CRITICAL Firebase configuration error: Missing API Key, Auth Domain, or Project ID. ' +
    'Please ensure NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, ' +
    'and NEXT_PUBLIC_FIREBASE_PROJECT_ID are correctly set in your .env.local file ' +
    'and that the Next.js server has been restarted. Firebase will NOT be initialized.'
  );
} else {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (initError) {
      console.error("Firebase app initialization failed:", initError);
      app = undefined; // Ensure app is undefined if init fails
    }
  } else {
    app = getApp();
  }

  if (app) {
    try {
        db = getFirestore(app);
    } catch (dbError) {
        console.error("Error initializing Firestore:", dbError);
        db = null;
    }
    
    try {
      auth = getAuth(app); // This is where the (auth/invalid-api-key) error often surfaces
    } catch (authError) {
      console.error(
        "Error initializing Firebase Authentication. " +
        "This is often due to an invalid API key or misconfiguration in the Firebase project:", 
        authError
      );
      auth = null; 
    }
  } else {
     console.error("Firebase app could not be initialized due to missing configuration or previous errors. Firestore and Auth will not be available.");
  }
}

// const storage = app ? getStorage(app) : null; // Uncomment if you need Firebase Storage
// let analytics; // Uncomment if you need Firebase Analytics
// if (typeof window !== 'undefined' && app) { // Ensure Analytics is only initialized on the client
//   analytics = getAnalytics(app);
// }

export { db, auth /*, storage, analytics */ };
