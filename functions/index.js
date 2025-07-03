/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Import necessary modules for Firebase Functions
const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");


// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

/**
 * Defines an HTTP Cloud Function named 'helloWorld'.
 * This function is triggered by an HTTP request.
 *
 * When this function is called:
 * 1. It logs a message to the Firebase Function logs using the 'logger'.
 * The 'structuredData: true' option is good practice for better log analysis.
 * 2. It sends a simple "Hello from Firebase!" string as the HTTP response.
 *
 * To access this function after deployment, Firebase will provide a URL.
 * Example URL: https://<REGION>-<PROJECT_ID>.cloudfunctions.net/helloWorld
 */
exports.helloWorld = onRequest((request, response) => {
  // Use the imported 'logger' to output information to the Firebase logs.
  // This helps in debugging and monitoring your function's execution.
  logger.info("Hello logs from Firebase Functions!", {structuredData: true});

  // Send an HTTP response back to the client that made the request.
  // This concludes the function's execution for the current request.
  response.send("Hello from Firebase!");
});


// IMPORTANT NOTE REGARDING THE "Parsing error: Unexpected token ."
// The previous "Parsing error: Unexpected token ." in functions/lib/index.js
// was likely NOT caused by the content of this specific index.js file,
// as this file is syntactically correct.
// If that error persists after deploying this updated file, it suggests:
// 1. There might be another source file in your functions project (e.g., in a 'src' folder)
//    that is being compiled into functions/lib/index.js and contains a syntax error.
// 2. Your Node.js version or build configuration might not be correctly set up
//    to transpile certain modern JavaScript features you might be using elsewhere.
// Please check any other JavaScript/TypeScript files in your 'functions' directory
// if the parsing error reappears after deploying this change.
