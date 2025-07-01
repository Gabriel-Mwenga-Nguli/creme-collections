"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessage = exports.helloWorld = exports.sendBrandedEmail = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const nodemailer = __importStar(require("nodemailer"));
// Initialize Firebase Admin SDK.
// This is necessary for functions to interact with other Firebase services
// (like Firestore, Auth, Storage) with admin privileges.
// The SDK automatically discovers credentials if deployed in a Firebase environment.
admin.initializeApp();
// Helper to get environment variables for email
const gmailEmail = functions.config().gmail?.email;
const gmailPassword = functions.config().gmail?.app_password;
// Nodemailer transporter setup
// IMPORTANT: For this to work, you must set the following environment variables in your Firebase project:
// firebase functions:config:set gmail.email="your-email@gmail.com"
// firebase functions:config:set gmail.app_password="your-gmail-app-password"
// Use a Gmail "App Password", not your regular password.
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});
exports.sendBrandedEmail = functions.https.onCall(async (data, context) => {
    // Check authentication
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    // In a real-world scenario, you would also verify that the caller has admin/manager privileges.
    // Example (requires custom claims or a user roles collection in Firestore):
    // const userRecord = await admin.auth().getUser(context.auth.uid);
    // if (!userRecord.customClaims?.isAdmin) {
    //   throw new functions.https.HttpsError("permission-denied", "You do not have permission to send emails.");
    // }
    const { to, subject, html } = data;
    if (!to || !subject || !html) {
        throw new functions.https.HttpsError("invalid-argument", "The function must be called with 'to', 'subject', and 'html' arguments.");
    }
    const mailOptions = {
        from: `"Creme Collections" <${gmailEmail}>`,
        to: to,
        subject: subject,
        html: html,
    };
    try {
        functions.logger.info(`Sending email to ${to} with subject: ${subject}`);
        await transporter.sendMail(mailOptions);
        functions.logger.info("Email sent successfully!");
        return { success: true, message: `Email successfully sent to ${to}` };
    }
    catch (error) {
        functions.logger.error("Error sending email:", error);
        throw new functions.https.HttpsError("internal", "Failed to send email.", error);
    }
});
// A simple Helloworld HTTP function for testing.
// You can access this function via its URL after deployment.
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello World function called!", { structuredData: true });
    response.status(200).send("Hello from Firebase Cloud Functions!");
});
// Example: A callable function
exports.addMessage = functions.https.onCall(async (data, context) => {
    // Check authentication
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    const text = data.text;
    if (!(typeof text === "string") || text.length === 0) {
        throw new functions.https.HttpsError("invalid-argument", "The function must be called with " +
            "one argument \"text\" containing the message text to add.");
    }
    try {
        const writeResult = await admin.firestore().collection("messages").add({
            text: text,
            author: context.auth.uid,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { messageId: writeResult.id, result: `Message with ID: ${writeResult.id} added.` };
    }
    catch (error) {
        functions.logger.error("Error adding message:", error);
        throw new functions.https.HttpsError("unknown", "Error writing to database", error);
    }
});
//# sourceMappingURL=index.js.map