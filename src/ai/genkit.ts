
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

export const ai = genkit({
  plugins: [
    googleAI(),
    enableFirebaseTelemetry, // This plugin handles sending traces and flow states to Firebase.
  ],
  model: 'googleai/gemini-2.0-flash', // Default model for generate requests
  flowStateStore: 'firebase', // Store flow states in Firestore
  traceStore: 'firebase',     // Store traces in Firestore
  // Removing explicit telemetry.instrumentation and telemetry.logger
  // to rely on enableFirebaseTelemetry defaults and avoid potential
  // Google Cloud auth issues if the environment isn't fully configured for direct Google Cloud logging/tracing.
  telemetry: {
    // logger: undefined, // Explicitly disable default Google Cloud Logging if needed
    // instrumentation: undefined, // Explicitly disable default OpenTelemetry if needed
  }
});
