
// console.log('[Firebase Module Load] Attempting to load and initialize Firebase services...'); // Removed this line

import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, type Analytics } from "firebase/analytics";

// Log environment variables at the VERY START of the module execution
console.log('[Firebase ENV Check] Raw NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Exists' : 'MISSING');
console.log('[Firebase ENV Check] Raw NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('[Firebase ENV Check] Raw NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID); // This will show what value is being read
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

console.log('[Firebase Module Start] Initial value of db:', db === null ? 'null' : 'not null');
console.log('[Firebase Module Start] Attempting to load Firebase Config from environment variables:', firebaseConfigValues);

// More specific check for projectId placeholder
const projectIdIsInvalid = !firebaseConfigValues.projectId ||
                           firebaseConfigValues.projectId.trim() === "" || // Check for empty string
                           firebaseConfigValues.projectId.toUpperCase() === "YOUR_PROJECT_ID" || // Case-insensitive check for common placeholder
                           firebaseConfigValues.projectId.toLowerCase().includes("your-project-id"); // Catch variations like "your-project-id-123" if that's how it's formatted in .env

if (
  !firebaseConfigValues.apiKey ||
  !firebaseConfigValues.authDomain ||
  projectIdIsInvalid
) {
  const apiKeyStatus = firebaseConfigValues.apiKey ? 'OK' : 'MISSING';
  const authDomainStatus = firebaseConfigValues.authDomain ? 'OK' : 'MISSING';
  
  let projectIdStatus = 'OK';
  if (!firebaseConfigValues.projectId || firebaseConfigValues.projectId.trim() === "") {
    projectIdStatus = 'MISSING (empty or not set)';
  } else if (firebaseConfigValues.projectId.toUpperCase() === "YOUR_PROJECT_ID" || firebaseConfigValues.projectId.toLowerCase().includes("your-project-id")) {
    projectIdStatus = `PLACEHOLDER ('${firebaseConfigValues.projectId}')`;
  } else {
    // This case means projectId is set, but apiKey or authDomain might be missing.
    // For the error message, if projectId is not the issue, show its actual value.
    projectIdStatus = firebaseConfigValues.projectId; 
  }
  // If the critical error is due to projectIdIsInvalid, ensure projectIdStatus reflects that.
  if (projectIdIsInvalid && (!firebaseConfigValues.projectId || firebaseConfigValues.projectId.trim() === "" || firebaseConfigValues.projectId.toUpperCase() === "YOUR_PROJECT_ID" || firebaseConfigValues.projectId.toLowerCase().includes("your-project-id"))) {
     projectIdStatus = `PLACEHOLDER ('${firebaseConfigValues.projectId || 'NOT SET'}')`;
  }


  console.error(
    `[Firebase] CRITICAL_CONFIG_MISSING: One or more critical Firebase configuration values (apiKey, authDomain, projectId) are missing or set to placeholder values. ` +
    `Checked values -> apiKey: [ ${apiKeyStatus} ], authDomain: [ ${authDomainStatus} ], projectId: [ ${projectIdStatus} ]. ` +
    `Firebase services will NOT be initialized. Please verify your .env.local file, ensure it contains the correct NEXT_PUBLIC_FIREBASE_PROJECT_ID and other Firebase variables, and that the Next.js server has been restarted.`
  );
  app = undefined;
  db = null;
  auth = null;
  storage = null;
  analytics = null;
} else {
  const firebaseConfig: FirebaseOptions = {
    apiKey: firebaseConfigValues.apiKey!, // At this point, these are considered valid
    authDomain: firebaseConfigValues.authDomain!,
    projectId: firebaseConfigValues.projectId!,
    storageBucket: firebaseConfigValues.storageBucket,
    messagingSenderId: firebaseConfigValues.messagingSenderId,
    appId: firebaseConfigValues.appId,
    measurementId: firebaseConfigValues.measurementId,
  };
  console.log('[Firebase] Using the following configuration for initialization:', firebaseConfig);

  if (!getApps().length) {
    try {
      console.log('[Firebase] Attempting to initialize Firebase app with provided config...');
      app = initializeApp(firebaseConfig);
      console.log('[Firebase] Firebase app initialized successfully.');
    } catch (initError) {
      console.error('[Firebase] FIREBASE_APP_INIT_ERROR: Firebase app initialization failed:', initError);
      app = undefined;
    }
  } else {
    app = getApp();
    console.log('[Firebase] Existing Firebase app retrieved.');
  }

  if (app) {
    try {
      console.log('[Firebase] Attempting to initialize Firestore...');
      const firestoreInstance = getFirestore(app);
      if (firestoreInstance) {
        db = firestoreInstance;
        console.log('[Firebase] Firestore initialized successfully. db is now SET.');
      } else {
        console.error('[Firebase] FIRESTORE_INIT_ERROR: getFirestore(app) returned undefined/null.');
        db = null;
      }
    } catch (dbError) {
      console.error('[Firebase] FIRESTORE_INIT_ERROR: Error initializing Firestore:', dbError);
      db = null;
    }
    
    try {
      console.log('[Firebase] Attempting to initialize Firebase Auth...');
      auth = getAuth(app); 
      console.log('[Firebase] Firebase Auth initialized successfully.');
    } catch (authError) {
      console.error(
        '[Firebase] FIREBASE_AUTH_INIT_ERROR: Error initializing Firebase Authentication:', 
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
     db = null;
     auth = null;
     storage = null;
     analytics = null;
  }
}

console.log('[Firebase Module End] Exporting db with value:', db === null ? 'null (Firestore NOT initialized or failed)' : 'VALID INSTANCE (Firestore SHOULD be working)');
export { db, auth, storage, analytics };

