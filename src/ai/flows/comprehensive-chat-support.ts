
'use server';
/**
 * @fileOverview A comprehensive AI-powered chat support agent.
 *
 * - comprehensiveChatSupport - Handles general customer support queries.
 * - ComprehensiveChatSupportInput - Input type for the comprehensiveChatSupport function.
 * - ComprehensiveChatSupportOutput - Output type for the comprehensiveChatSupport function.
 */

import {ai} from '@/ai/genkit';
import {z}from 'genkit';

const ComprehensiveChatSupportInputSchema = z.object({
  message: z.string().describe('The user current message.'),
  // Temporarily removed for simplification
  // chatHistory: z.array(z.object({
  //   role: z.enum(['user', 'model']),
  //   content: z.string(),
  // })).optional().describe('The history of the conversation so far, excluding the current user message.'),
  // isLoggedIn: z.boolean().optional().describe('Whether the user is currently logged in.'),
  // userName: z.string().optional().describe('The name of the user, if logged in.'),
});
export type ComprehensiveChatSupportInput = z.infer<typeof ComprehensiveChatSupportInputSchema>;

const ComprehensiveChatSupportOutputSchema = z.object({
  response: z.string().describe('The AI-generated answer to the user query.'),
});
export type ComprehensiveChatSupportOutput = z.infer<typeof ComprehensiveChatSupportOutputSchema>;

export async function comprehensiveChatSupport(input: ComprehensiveChatSupportInput): Promise<ComprehensiveChatSupportOutput> {
  return comprehensiveChatSupportFlow(input);
}

const comprehensiveChatPrompt = ai.definePrompt({
  name: 'comprehensiveChatSupportPrompt',
  model: 'googleai/gemini-2.0-flash', // Changed model to default flash
  input: { schema: ComprehensiveChatSupportInputSchema }, 
  output: { schema: ComprehensiveChatSupportOutputSchema },
  prompt: `You are "CremeBot", a helpful AI assistant for "Creme Collections".
User says: {{{message}}}
Respond very simply.
`,
});

const comprehensiveChatSupportFlow = ai.defineFlow(
  {
    name: 'comprehensiveChatSupportFlow',
    inputSchema: ComprehensiveChatSupportInputSchema,
    outputSchema: ComprehensiveChatSupportOutputSchema,
  },
  async (input) => {
    const { output } = await comprehensiveChatPrompt({ message: input.message });
    return output!;
  }
);

