/**
 * @fileOverview Cloud Functions for Firebase.
 *
 * This file is the entry point for your Firebase Functions.
 * You can define HTTP, Pub/Sub, Auth, Firestore, and other types of triggers here.
 *
 * For AI-related backend logic, consider using Genkit flows which are already
 * part of your project structure in `src/ai/flows/`. Genkit flows can be deployed
 * and managed separately.
 *
 * Firebase Functions are suitable for general backend tasks, event handling,
 * and integrations that are not directly AI model interactions.
 *
 * Learn more about Firebase Functions at:
 * https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK.
// This is necessary for functions to interact with other Firebase services
// (like Firestore, Auth, Storage) with admin privileges.
// The SDK automatically discovers credentials if deployed in a Firebase environment.
admin.initializeApp();

// A simple Helloworld HTTP function for testing.
// You can access this function via its URL after deployment.
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello World function called!", {structuredData: true});
  response.status(200).send("Hello from Firebase Cloud Functions!");
});

// Example: A callable function
// Callable functions can be invoked directly from your client-side application.
export const addMessage = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.",
    );
  }

  const text = data.text;
  if (!(typeof text === "string") || text.length === 0) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with " +
        "one argument \"text\" containing the message text to add.",
    );
  }

  try {
    const writeResult = await admin.firestore().collection("messages").add({
      text: text,
      author: context.auth.uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    return {messageId: writeResult.id, result: `Message with ID: ${writeResult.id} added.`};
  } catch (error) {
    functions.logger.error("Error adding message:", error);
    throw new functions.https.HttpsError("unknown", "Error writing to database", error);
  }
});


// Add more functions below.
// For example, a Firestore trigger:
//
// export const onMessageCreate = functions.firestore
//   .document("messages/{messageId}")
//   .onCreate(async (snap, context) => {
//     const messageId = context.params.messageId;
//     const messageData = snap.data();
//     functions.logger.log(`New message ${messageId} created:`, messageData);
//     // Perform actions, e.g., send a notification, transform data, etc.
//     return null;
//   });

// Remember to deploy your functions using the Firebase CLI:
// firebase deploy --only functions
