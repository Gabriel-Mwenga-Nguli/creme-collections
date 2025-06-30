
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
// import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

// Telemetry is temporarily disabled to resolve a build issue.
// enableFirebaseTelemetry();

export const ai = genkit({
  plugins: [
    googleAI({apiKey: process.env.GOOGLE_API_KEY}),
  ],
  model: 'googleai/gemini-1.5-flash', // Default model for generate requests
  flowStateStore: 'memory',
  traceStore: 'memory',
});
