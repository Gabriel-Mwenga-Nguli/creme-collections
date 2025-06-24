
import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from 'firebase/app-check';

const firebaseConfigValues = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseConfig: FirebaseOptions = firebaseConfigValues;

let app: FirebaseApp;
let auth: Auth;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let appCheck: AppCheck | null = null;

if (firebaseConfig.projectId) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  if (typeof window !== 'undefined') {
    const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (key) {
      appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(key),
        isTokenAutoRefreshEnabled: true,
      });
    } else {
        console.warn("[Firebase Module Load] reCAPTCHA key not found. App Check will not be initialized.");
    }
  }

  console.log('[Firebase Module Load] Firebase initialized with Project ID:', firebaseConfig.projectId);
} else {
  console.warn(
    '[Firebase Module Load] Firebase config is missing. App will not connect to Firebase. ' +
    'Ensure you have a .env.local file with NEXT_PUBLIC_FIREBASE_... variables.'
  );
  // Assign null to auth if firebase is not configured
  auth = null as any; 
}

export { db, auth, storage, appCheck };
