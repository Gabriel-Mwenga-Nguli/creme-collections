'use server';
/**
 * @fileOverview A simple "hello world" flow.
 *
 * - sayHello - A function that takes a name and returns a greeting.
 * - HelloInput - The input type for the sayHello function.
 * - HelloOutput - The return type for the sayHello function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HelloInputSchema = z.object({
  name: z.string().describe('The name to greet.'),
});
export type HelloInput = z.infer<typeof HelloInputSchema>;

const HelloOutputSchema = z.object({
  greeting: z.string().describe('The generated greeting.'),
});
export type HelloOutput = z.infer<typeof HelloOutputSchema>;

// This exported function is what your app's components will call.
export async function sayHello(input: HelloInput): Promise<HelloOutput> {
  return helloFlow(input);
}

// This is the Genkit flow definition.
const helloFlow = ai.defineFlow(
  {
    name: 'helloFlow',
    inputSchema: HelloInputSchema,
    outputSchema: HelloOutputSchema,
  },
  async (input) => {
    // The ai.generate() call uses the default model configured in `src/ai/genkit.ts`
    const { text } = await ai.generate(`Hello Gemini, my name is ${input.name}`);
    return { greeting: text };
  }
);
