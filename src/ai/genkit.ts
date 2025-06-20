
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
// Removed: import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

export const ai = genkit({
  plugins: [
    googleAI(),
    // Removed: enableFirebaseTelemetry,
  ],
  model: 'googleai/gemini-2.0-flash', // Default model for generate requests
  flowStateStore: 'memory', // Changed to memory for diagnostics
  traceStore: 'memory',     // Changed to memory for diagnostics
  telemetry: {
    logger: undefined, // Explicitly disable default Google Cloud Logging
    instrumentation: undefined, // Explicitly disable default OpenTelemetry for Google Cloud
  }
});
