
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import type { FirebaseStorage } from 'firebase/storage';
import type { AppCheck } from 'firebase/app-check';

// ============================================================================
// IMPORTANT: FIREBASE SIMULATION MODE
// ============================================================================
// All Firebase services are explicitly set to null.
// This DISCONNECTS the app from any backend, allowing for frontend-only
// development and UI testing without a real Firebase project.
//
// All data is sourced from mock files in the `/src/services` directory.
// Features like login, registration, and database writes are simulated.
//
// To connect to a real Firebase backend:
// 1. Fill in your Firebase config in a `.env.local` file.
// 2. Uncomment the initialization code below.
// 3. Remove the null assignments.
// ============================================================================

const app: FirebaseApp | null = null;
const auth: Auth | null = null;
const db: Firestore | null = null;
const storage: FirebaseStorage | null = null;
const appCheck: AppCheck | null = null;

/*
// ===== EXAMPLE: REAL FIREBASE INITIALIZATION =====
// 1. Make sure you have a .env.local file with your Firebase config.
// 2. Uncomment the code below.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize App Check
if (typeof window !== 'undefined') {
  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!),
    isTokenAutoRefreshEnabled: true
  });
} else {
  appCheck = null;
}
*/

export { app, auth, db, storage, appCheck };
