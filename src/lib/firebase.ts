
// console.log('[Firebase Module Load] Attempting to load and initialize Firebase services...'); // Removed this line

import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, type Analytics } from "firebase/analytics";

// Log environment variables at the VERY START of the module execution
// These logs are crucial for debugging environment variable loading issues.
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

console.log('[Firebase Module Start] Initial value of db:', db === null ? 'null' : 'not null');
console.log('[Firebase Module Start] Attempting to load Firebase Config from environment variables. Parsed values:', firebaseConfigValues);

const projectIdIsMissingOrPlaceholder = !firebaseConfigValues.projectId ||
                                      firebaseConfigValues.projectId.trim() === "" ||
                                      firebaseConfigValues.projectId.toUpperCase().includes("YOUR_PROJECT_ID");

if (
  !firebaseConfigValues.apiKey ||
  !firebaseConfigValues.authDomain ||
  projectIdIsMissingOrPlaceholder
) {
  const apiKeyStatus = firebaseConfigValues.apiKey ? 'OK' : 'MISSING or invalid';
  const authDomainStatus = firebaseConfigValues.authDomain ? 'OK' : 'MISSING or invalid';
  
  let projectIdStatusDetail = 'OK';
  if (!firebaseConfigValues.projectId || firebaseConfigValues.projectId.trim() === "") {
    projectIdStatusDetail = 'MISSING (empty or not set in .env.local)';
  } else if (firebaseConfigValues.projectId.toUpperCase().includes("YOUR_PROJECT_ID")) {
    projectIdStatusDetail = `PLACEHOLDER ('${firebaseConfigValues.projectId}') - Please replace with your actual Firebase Project ID.`;
  } else {
    projectIdStatusDetail = firebaseConfigValues.projectId; 
  }
  
  if (projectIdIsMissingOrPlaceholder) {
     projectIdStatusDetail = `MISSING or PLACEHOLDER ('${firebaseConfigValues.projectId || 'NOT SET'}') - Please set NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env.local to your actual Firebase Project ID.`;
  }


  console.error(
    `[Firebase] CRITICAL_CONFIG_MISSING: Firebase initialization failed due to missing or placeholder configuration values. ` +
    `Please check your .env.local file and ensure all NEXT_PUBLIC_FIREBASE_... variables, especially API_KEY, AUTH_DOMAIN, and PROJECT_ID, are correctly set with your project's actual credentials. ` +
    `\n  - NEXT_PUBLIC_FIREBASE_API_KEY status: [ ${apiKeyStatus} ]` +
    `\n  - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN status: [ ${authDomainStatus} ]` +
    `\n  - NEXT_PUBLIC_FIREBASE_PROJECT_ID status: [ ${projectIdStatusDetail} ]` +
    `\nAfter correcting .env.local, YOU MUST RESTART your Next.js development server.`
  );
  app = undefined;
  db = null;
  auth = null;
  storage = null;
  analytics = null;
} else {
  const firebaseConfig: FirebaseOptions = {
    apiKey: firebaseConfigValues.apiKey!, 
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
