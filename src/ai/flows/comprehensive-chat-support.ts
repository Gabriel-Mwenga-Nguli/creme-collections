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

{{#if isLoggedIn}}
The user is logged in.
{{#if userName}}Their name is {{{userName}}}. Address them by their name where it feels natural.{{/if}}
{{else}}
The user is not logged in.
{{/if}}

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
3.  If the user asks about something you cannot do (e.g., process a refund directly, change personal details), politely explain the limitation.
4.  If you determine the user needs to speak with a human support agent for complex issues (like a damaged order, a specific account problem, or a refund request), you MUST include the special phrase "[NEEDS_HUMAN_LOGIN_REQUIRED]" in your response. This phrase will be used by the system to trigger a handoff process.
    - Example: "I understand this is frustrating. To resolve this, I need to connect you with a support agent. [NEEDS_HUMAN_LOGIN_REQUIRED]"

Do not make up information about products or orders if you don't have it. It's better to say "I'm sorry, I don't have access to that specific information, but I can help you find your order history page."

Respond to the user's current message now.`,
});

const comprehensiveChatSupportFlow = ai.defineFlow(
  {
    name: 'comprehensiveChatSupportFlow',
    inputSchema: ComprehensiveChatSupportInputSchema,
    outputSchema: ComprehensiveChatSupportOutputSchema,
  },
  async (input) => {
    const promptInput = {
      ...input,
      currentDate: new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    };

    const { output } = await comprehensiveChatPrompt(promptInput);
    if (!output) {
      return { response: "I'm sorry, I encountered an issue and can't respond right now. Please try again in a moment." };
    }
    return output;
  }
);
