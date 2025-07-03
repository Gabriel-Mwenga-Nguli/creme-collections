
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
import * as nodemailer from "nodemailer";
import axios from "axios";

// Initialize Firebase Admin SDK.
// This is necessary for functions to interact with other Firebase services
// (like Firestore, Auth, Storage) with admin privileges.
// The SDK automatically discovers credentials if deployed in a Firebase environment.
admin.initializeApp();

// --- Email Service ---

// Helper to get environment variables for email
const gmailEmail = functions.config().gmail?.email;
const gmailPassword = functions.config().gmail?.app_password;

// Lazily initialize the transporter to prevent crashes on deploy if config is missing
let transporter: nodemailer.Transporter | null = null;
if (gmailEmail && gmailPassword) {
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: gmailEmail,
            pass: gmailPassword,
        },
    });
} else {
    functions.logger.warn("Gmail config not set. Email function will be disabled. Run 'firebase functions:config:set gmail.email=...' and 'gmail.app_password=...'. See EMAIL_SETUP.md for details.");
}


export const sendBrandedEmail = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
  // Check if the transporter was initialized
    if (!transporter) {
        functions.logger.error("sendBrandedEmail called, but email service is not configured.");
        throw new functions.https.HttpsError('failed-precondition', 'The email service is not configured on the server. Please see EMAIL_SETUP.md.');
    }
  
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.",
    );
  }

  const { to, subject, html } = data;

  if (!to || !subject || !html) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with 'to', 'subject', and 'html' arguments.",
    );
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
  } catch (error) {
    functions.logger.error("Error sending email:", error);
    throw new functions.https.HttpsError("internal", "Failed to send email.", error);
  }
});


// --- Loyverse Integration ---

// Access the Loyverse API Token from the environment configuration
const loyverseApiToken = functions.config().loyverse?.apitoken;

// Basic check to ensure the token is set during initialization
if (!loyverseApiToken) {
    functions.logger.warn("CRITICAL: Loyverse API token is not set in Firebase config. Run 'firebase functions:config:set loyverse.apitoken=YOUR_TOKEN'. See LOYVERSE_SETUP.md for details.");
}

/**
 * Firebase Callable Function to fetch products from Loyverse.
 * This function acts as a secure proxy to prevent exposing the Loyverse API token on the client-side.
 */
export const getLoyverseProducts = functions.https.onCall(async (data, context) => {
    // Optional: Implement authentication/authorization if you want to restrict who can call this function
    // For example, only authenticated Firebase users:
    // if (!context.auth) {
    //     throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    // }

    if (!loyverseApiToken) {
        functions.logger.error("getLoyverseProducts called, but token is missing.");
        throw new functions.https.HttpsError('failed-precondition', 'Loyverse API token is not configured on the server. See LOYVERSE_SETUP.md for details.');
    }

    try {
        // Make a GET request to the Loyverse Items API endpoint
        const response = await axios.get('https://api.loyverse.com/v1.0/items', {
            headers: {
                'Authorization': `Bearer ${loyverseApiToken}`,
                'Content-Type': 'application/json',
            },
        });

        // Loyverse API returns items in `response.data.items`
        const rawItems: any[] = response.data.items || [];

        // Process and format the product data for your frontend
        // NOTE: This mapping is an assumption. You must verify the actual field names from the Loyverse API documentation.
        const products = rawItems.map(item => ({
            id: item.id, // Loyverse item ID (crucial for order creation)
            name: item.item_name,
            price: item.variants?.[0]?.default_price || 0,
            description: item.description || '', // Assuming description might be optional
            sku: item.variants?.[0]?.sku || '',
            imageUrl: item.image_url || 'https://placehold.co/600x400.png',
            dataAiHint: item.item_name ? item.item_name.toLowerCase().split(' ').slice(0, 2).join(' ') : 'product',
            stock: item.variants?.[0]?.in_stock || 0,
        }));

        return { products };

    } catch (error: any) {
        functions.logger.error('Error fetching Loyverse products:', error.response ? error.response.data : error.message);
        // Provide a user-friendly error message
        throw new functions.https.HttpsError('internal', 'Failed to retrieve products from the inventory system.', error.message);
    }
});
