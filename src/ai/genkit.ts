
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase'; // Changed import path and name

export const ai = genkit({
  plugins: [
    googleAI(),
    enableFirebaseTelemetry, // Use the imported reference directly
  ],
  model: 'googleai/gemini-2.0-flash',
  telemetry: {
    instrumentation: {
      // For OpenTelemetry compatible systems.
      // exporter: new ConsoleMetricExporter(),
      // metrics: {exportIntervalMillis: 5000}
    },
    logger: {
      // For Google Cloud Logging.
      // logger: new GoogleCloudLogger(),
    }
  },
  flowStateStore: 'firebase', // Optional: Store flow states in Firestore
  traceStore: 'firebase', // Optional: Store traces in Firestore (can also use Google Cloud Tracing)
});

