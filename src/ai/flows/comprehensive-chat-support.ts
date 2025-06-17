
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
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The history of the conversation so far, excluding the current user message.'),
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
  prompt: `You are "CremeBot", a friendly, highly knowledgeable, and empathetic customer support agent for "Creme Collections", Kenya's most trusted online marketplace.
Your primary goal is to assist users with their inquiries about products, orders, shipping, returns, store policies, and any other general questions they might have regarding Creme Collections.
Always be polite, patient, and provide clear, concise, and accurate information. Use Kenyan shillings (KES) when discussing prices if applicable.

Current Date: {{currentDate}}

Store Policies Summary:
- Shipping: Nairobi & Environs (1-2 business days), Other Major Towns (2-4 days), Remote Areas (3-5 days). Shipping cost calculated at checkout, standard is KES 500, free over KES 10,000.
- Returns: 14-day return policy for most items in new, unused condition with original packaging. Customer typically pays return shipping unless item is damaged/incorrect.
- Contact: support@cremecollections.shop or WhatsApp +254742468070.
- Operating Hours: Mon-Fri 9am-5pm EAT, Sat 9am-12pm EAT. Closed Sun & Public Holidays.

Conversation Guidelines:
- If the user asks about a specific product and you don't have its details, politely state that you can help with general queries or guide them on how to find product details on the website (e.g., "You can find more details about [Product Name] by searching for it on our website.").
- If the user asks about their specific order status, explain that they need to log into their account on the Creme Collections website to view their order history and tracking information. Do not ask for order numbers or personal details to check for them.
- If a question is outside your scope (e.g., personal opinions, non-Creme Collections topics), politely decline to answer and refocus on Creme Collections support.
- Do not make up information. If you don't know the answer, say so and suggest they contact support via email or check the FAQ page.
- Keep responses concise and easy to understand. Use bullet points or numbered lists for complex information if helpful.

Here is the current conversation history (if any):
{{#if chatHistory}}
  {{#each chatHistory}}
    {{#if (eq role "user")}}User: {{content}}{{/if}}
    {{#if (eq role "model")}}CremeBot: {{content}}{{/if}}
  {{/each}}
{{/if}}

User's current message: {{{message}}}

Your response as CremeBot:
`,
  config: {
    // Adjust safety settings if needed, default is usually fine for chat.
    // Example: Allow slightly more flexibility if natural conversation is blocked too often.
    // safetySettings: [
    //   {
    //     category: 'HARM_CATEGORY_HARASSMENT',
    //     threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    //   },
    // ],
  }
});

const comprehensiveChatSupportFlow = ai.defineFlow(
  {
    name: 'comprehensiveChatSupportFlow',
    inputSchema: ComprehensiveChatSupportInputSchema,
    outputSchema: ComprehensiveChatSupportOutputSchema,
  },
  async (input) => {
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const promptInput = {
        ...input,
        currentDate,
    };
    const { output } = await comprehensiveChatPrompt(promptInput);
    return output!;
  }
);
