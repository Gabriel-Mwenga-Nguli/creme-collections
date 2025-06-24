
// This file is intentionally left blank to disable Firebase services for local development.
// All Firebase initializations and exports have been removed to prevent backend calls.

const db = null;
const auth = null;
const storage = null;
const appCheck = null;

console.warn(
  "[DEV MODE] Firebase services are disabled. The app is running on local mock data. " +
  "To re-enable Firebase, restore the contents of 'src/lib/firebase.ts' and related services."
);

export { db, auth, storage, appCheck };
