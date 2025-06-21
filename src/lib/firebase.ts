
// console.log('[Firebase Module Load] Attempting to load and initialize Firebase services...'); // Removed this line

import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, type Analytics } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from 'firebase/app-check';

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
let appCheck: AppCheck | null = null;

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
  appCheck = null;
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
  
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (initError) {
      console.error('[Firebase] FIREBASE_APP_INIT_ERROR: Firebase app initialization failed:', initError);
      app = undefined;
    }
  } else {
    app = getApp();
  }

  if (app) {
    try {
      db = getFirestore(app);
    } catch (dbError) {
      console.error('[Firebase] FIRESTORE_INIT_ERROR: Error initializing Firestore:', dbError);
      db = null;
    }
    
    try {
      auth = getAuth(app); 
    } catch (authError) {
      console.error(
        '[Firebase] FIREBASE_AUTH_INIT_ERROR: Error initializing Firebase Authentication:', 
        authError
      );
      auth = null; 
    }

    try {
      storage = getStorage(app);
    } catch (storageError) {
      console.error('[Firebase] FIREBASE_STORAGE_INIT_ERROR: Error initializing Firebase Storage:', storageError);
      storage = null;
    }

    if (typeof window !== 'undefined') {
      try {
        analytics = getAnalytics(app);
      } catch (analyticsError) {
        console.error('[Firebase] FIREBASE_ANALYTICS_INIT_ERROR: Error initializing Firebase Analytics:', analyticsError);
        analytics = null;
      }
      try {
        if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
          appCheck = initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
            isTokenAutoRefreshEnabled: true 
          });
        } else {
          console.warn('[Firebase] APP_CHECK_WARN: NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set. App Check will not be initialized.');
          appCheck = null;
        }
      } catch (appCheckError) {
        console.error('[Firebase] FIREBASE_APP_CHECK_INIT_ERROR: Error initializing Firebase App Check:', appCheckError);
        appCheck = null;
      }

    }

  } else {
     console.error("[Firebase] FIREBASE_APP_UNAVAILABLE: Firebase app object is not available. Firebase services will not be available.");
     db = null;
     auth = null;
     storage = null;
     analytics = null;
     appCheck = null;
  }
}

export { db, auth, storage, analytics, appCheck };
