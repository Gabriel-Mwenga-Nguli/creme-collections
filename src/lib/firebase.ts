
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import type { FirebaseStorage } from 'firebase/storage';
import type { AppCheck } from 'firebase/app-check';

// All Firebase services are explicitly set to null.
// This effectively disables Firebase for the entire application.
const app: FirebaseApp | null = null;
const auth: Auth | null = null;
const db: Firestore | null = null;
const storage: FirebaseStorage | null = null;
const appCheck: AppCheck | null = null;

if (typeof window !== 'undefined') {
  console.warn(
    '[SIMULATION MODE] Firebase is disabled. The app is running in a frontend-only simulation mode. ' +