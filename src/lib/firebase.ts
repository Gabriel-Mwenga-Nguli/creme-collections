
console.log('[Firebase Module Load] Attempting to load and initialize Firebase services...'); // Added log

import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, type Analytics } from "firebase/analytics";

// Log environment variables at the VERY START of the module execution
console.log('[Firebase ENV Check] Raw NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Exists' : 'MISSING');
console.log('[Firebase ENV Check] Raw NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('[Firebase ENV Check] Raw NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('[Firebase ENV Check] Raw NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
console.log('[Firebase ENV Check] Raw NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
console.log('[Firebase ENV Check] Raw NEXT_PUBLIC_FIREBASE_APP_ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
console.log('[Firebase ENV Check] Raw NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID);


const firebaseConfigValues = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | undefined;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;

// CRITICAL: Log the config values being read from environment variables
console.log('[Firebase] Attempting to load Firebase Config from environment variables:', {
  apiKeyExists: !!firebaseConfigValues.apiKey,
  authDomain: firebaseConfigValues.authDomain,
  projectId: firebaseConfigValues.projectId, // This will show "YOUR_PROJECT_ID" if not set correctly
  storageBucketExists: !!firebaseConfigValues.storageBucket,
  messagingSenderIdExists: !!firebaseConfigValues.messagingSenderId,
  appIdExists: !!firebaseConfigValues.appId,
  measurementIdExists: !!firebaseConfigValues.measurementId,
});

if (
  !firebaseConfigValues.apiKey ||
  !firebaseConfigValues.authDomain ||
  !firebaseConfigValues.projectId ||
  firebaseConfigValues.projectId === "YOUR_PROJECT_ID" || // Explicitly check for placeholder
  firebaseConfigValues.projectId.includes("your-project-id") // Catch common placeholder variations
) {
  console.error(
    '[Firebase] CRITICAL_CONFIG_MISSING: One or more critical Firebase configuration values (apiKey, authDomain, projectId) are missing or set to placeholder values in environment variables. These are expected as NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, and NEXT_PUBLIC_FIREBASE_PROJECT_ID. Firebase services will NOT be initialized. Please verify your .env.local file and ensure the Next.js server has been restarted.'
  );
} else {
  const firebaseConfig: FirebaseOptions = {
    apiKey: firebaseConfigValues.apiKey,
    authDomain: firebaseConfigValues.authDomain,
    projectId: firebaseConfigValues.projectId,
    storageBucket: firebaseConfigValues.storageBucket,
    messagingSenderId: firebaseConfigValues.messagingSenderId,
    appId: firebaseConfigValues.appId,
    measurementId: firebaseConfigValues.measurementId,
  };

  if (!getApps().length) {
    try {
      console.log('[Firebase] Attempting to initialize Firebase app with provided config...');
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

    try {
      console.log('[Firebase] Attempting to initialize Firebase Storage...');
      storage = getStorage(app);
      console.log('[Firebase] Firebase Storage initialized successfully.');
    } catch (storageError) {
      console.error('[Firebase] FIREBASE_STORAGE_INIT_ERROR: Error initializing Firebase Storage:', storageError);
      storage = null;
    }

    if (typeof window !== 'undefined') {
      try {
        console.log('[Firebase] Attempting to initialize Firebase Analytics (client-side)...');
        analytics = getAnalytics(app);
        console.log('[Firebase] Firebase Analytics initialized successfully.');
      } catch (analyticsError) {
        console.error('[Firebase] FIREBASE_ANALYTICS_INIT_ERROR: Error initializing Firebase Analytics:', analyticsError);
        analytics = null;
      }
    } else {
      console.log('[Firebase] Firebase Analytics not initialized (server-side).');
    }

  } else {
     console.error("[Firebase] FIREBASE_APP_UNAVAILABLE: Firebase app object is not available (likely due to missing or invalid config, or a prior initialization error). Firestore, Auth, Storage, and Analytics will not be available.");
  }
}

export { db, auth, storage, analytics };
