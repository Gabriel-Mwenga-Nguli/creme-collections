'use server';

/**
 * @fileOverview An AI-powered chat support agent for assisting customers with product-related questions.
 *
 * - aiChatSupport - A function that handles the chat support process.
 * - AIChatSupportInput - The input type for the aiChatSupport function.
 * - AIChatSupportOutput - The return type for the aiChatSupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatSupportInputSchema = z.object({
  question: z.string().describe('The customer question.'),
  productName: z.string().describe('The name of the product the customer is asking about.'),
  productDescription: z.string().describe('The description of the product.'),
});
export type AIChatSupportInput = z.infer<typeof AIChatSupportInputSchema>;

const AIChatSupportOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the customer question.'),
});
export type AIChatSupportOutput = z.infer<typeof AIChatSupportOutputSchema>;

export async function aiChatSupport(input: AIChatSupportInput): Promise<AIChatSupportOutput> {
  return aiChatSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatSupportPrompt',
  input: {schema: AIChatSupportInputSchema},
  output: {schema: AIChatSupportOutputSchema},
  prompt: `You are a helpful AI-powered chat support agent for an e-commerce website.
You are assisting a customer with questions about a specific product.
Use the provided product information to answer the customer's question as accurately and helpfully as possible.

Product Name: {{{productName}}}
Product Description: {{{productDescription}}}

Customer Question: {{{question}}}

Answer: `,
});

const aiChatSupportFlow = ai.defineFlow(
  {
    name: 'aiChatSupportFlow',
    inputSchema: AIChatSupportInputSchema,
    outputSchema: AIChatSupportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
