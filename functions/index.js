/**
 * This file is the entry point for your Firebase Functions in JavaScript.
 *
 * NOTE: Your project is configured to use TypeScript in the `src` directory.
 * The main entry point for deployment is `lib/index.js`, which is compiled
 * from `src/index.ts`. This file is kept for compatibility but is not
 * the primary source for your functions.
 *
 * To add new functions, please modify `src/index.ts`.
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// A simple placeholder function.
exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello from Firebase!", {structuredData: true});
  response.send("Hello from Firebase!");
});
