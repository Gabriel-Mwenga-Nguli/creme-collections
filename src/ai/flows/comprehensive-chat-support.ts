
'use server';
/**
 * @fileOverview A comprehensive AI-powered chat support agent.
 *
 * - comprehensiveChatSupport - Handles general customer support queries.
 * - ComprehensiveChatSupportInput - Input type for the comprehensiveChatSupport function.
 * - ComprehensiveChatSupportOutput - Output type for the comprehensiveChatSupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { type ChatMessage } from '@/components/features/chat/ChatWidget';

const ComprehensiveChatSupportInputSchema = z.object({
  message: z.string().describe('The user current message.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The history of the conversation so far, excluding the current user message.'),
  isLoggedIn: z.boolean().optional().describe('Whether the user is currently logged in.'),
  userName: z.string().optional().describe('The name of the user, if logged in.'),
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
  input: { schema: ComprehensiveChatSupportInputSchema }, 
  output: { schema: ComprehensiveChatSupportOutputSchema },
  prompt: `You are "CremeBot", a friendly and helpful AI assistant for "Creme Collections", an e-commerce store in Kenya.
Your goal is to provide excellent customer service.
Be concise and clear in your responses. Use markdown for formatting like lists or bold text where appropriate.

Today's date is {{currentDate}}.

The user is not logged in because user accounts are currently disabled. Do not ask them to log in.

Here is the conversation history so far (if any):
{{#if chatHistory}}
  {{#each chatHistory}}
    {{#if (eq role 'user')}}User: {{content}}{{/if}}
    {{#if (eq role 'model')}}CremeBot: {{content}}{{/if}}
  {{/each}}
{{/if}}

Current user message: {{{message}}}

Your Task:
1.  Analyze the user's message in the context of the conversation history.
2.  Provide a direct, helpful, and friendly response.
3.  If the user asks about something you cannot do (e.g., check order status, process a refund, change personal details), politely explain the limitation and suggest they contact support via email at support@cremecollections.shop or WhatsApp at +254742468070.
4.  Do not use the special phrase "[NEEDS_HUMAN_LOGIN_REQUIRED]" as login is disabled.

Do not make up information about products or orders if you don't have it. It's better to say "I'm sorry, I don't have access to that specific information, but I can help you find products on our site."

Respond to the user's current message now.`,
});

const comprehensiveChatSupportFlow = ai.defineFlow(
  {
    name: 'comprehensiveChatSupportFlow',
    inputSchema: ComprehensiveChatSupportInputSchema,
    outputSchema: ComprehensiveChatSupportOutputSchema,
  },
  async (input) => {
    // Override login status since auth is disabled
    const promptInput = {
      ...input,
      isLoggedIn: false,
      userName: undefined,
      currentDate: new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    };

    const { output } = await comprehensiveChatPrompt(promptInput);
    if (!output) {
      return { response: "I'm sorry, I encountered an issue and can't respond right now. Please try again in a moment." };
    }
    return output;
  }
);
