
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
    'FIREBASE_CONFIG_ERROR: Critical Firebase configuration (apiKey, authDomain, or projectId) is missing. ' +
    'Please ensure NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, ' +
    'and NEXT_PUBLIC_FIREBASE_PROJECT_ID are correctly set in your .env.local file ' +
    'and that the Next.js server has been restarted. Firebase will NOT be initialized.'
  );
} else {
  if (!getApps().length) {
    try {
      console.log('[Firebase] Attempting to initialize Firebase app...');
      app = initializeApp(firebaseConfig);
      console.log('[Firebase] Firebase app initialized successfully.');
    } catch (initError) {
      console.error('[Firebase] FIREBASE_APP_INIT_ERROR: Firebase app initialization failed:', initError);
      app = undefined; // Ensure app is undefined if init fails
    }
  } else {
    app = getApp();
    console.log('[Firebase] Existing Firebase app retrieved.');
  }

  if (app) {
    try {
      console.log('[Firebase] Attempting to initialize Firestore...');
      db = getFirestore(app);
      console.log('[Firebase] Firestore initialized successfully.');
    } catch (dbError) {
      console.error('[Firebase] FIRESTORE_INIT_ERROR: Error initializing Firestore:', dbError);
      db = null; // Ensure db is null if getFirestore fails
    }
    
    try {
      console.log('[Firebase] Attempting to initialize Firebase Auth...');
      auth = getAuth(app); 
      console.log('[Firebase] Firebase Auth initialized successfully.');
    } catch (authError) {
      console.error(
        '[Firebase] FIREBASE_AUTH_INIT_ERROR: Error initializing Firebase Authentication. This can be due to an invalid API key or misconfiguration:', 
        authError
      );
      auth = null; 
    }
  } else {
     console.error("[Firebase] FIREBASE_APP_UNAVAILABLE: Firebase app object is not available (likely due to missing config or a prior initialization error). Firestore and Auth will not be available.");
  }
}

// const storage = app ? getStorage(app) : null; // Uncomment if you need Firebase Storage
// let analytics; // Uncomment if you need Firebase Analytics
// if (typeof window !== 'undefined' && app) { // Ensure Analytics is only initialized on the client
//   analytics = getAnalytics(app);
// }

export { db, auth /*, storage, analytics */ };

