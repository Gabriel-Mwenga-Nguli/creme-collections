'use server';

/**
 * @fileOverview AI-powered product search flow that intelligently finds relevant products based on user keywords.
 *
 * - smartProductSearch - A function that handles the product search process.
 * - SmartProductSearchInput - The input type for the smartProductSearch function.
 * - SmartProductSearchOutput - The return type for the smartProductSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartProductSearchInputSchema = z.object({
  searchTerm: z.string().describe('The search term entered by the user.'),
});
export type SmartProductSearchInput = z.infer<typeof SmartProductSearchInputSchema>;

const SmartProductSearchOutputSchema = z.object({
  products: z
    .array(z.string())
    .describe('A list of relevant product names based on the search term.'),
  reasoning: z.string().describe('Explanation of why these products were returned.'),
});
export type SmartProductSearchOutput = z.infer<typeof SmartProductSearchOutputSchema>;

export async function smartProductSearch(input: SmartProductSearchInput): Promise<SmartProductSearchOutput> {
  return smartProductSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartProductSearchPrompt',
  input: {schema: SmartProductSearchInputSchema},
  output: {schema: SmartProductSearchOutputSchema},
  prompt: `You are an AI assistant helping users find products in an online store.

  The user is searching for: {{{searchTerm}}}

  Based on the search term, identify relevant products from the following list:

  [List of available products will be inserted here by the calling function]

  Return a list of product names that are most relevant to the search term, even if the search term is not an exact match.
  Also provide a short explanation of why these products were returned in the reasoning field.
  `,
});

const smartProductSearchFlow = ai.defineFlow(
  {
    name: 'smartProductSearchFlow',
    inputSchema: SmartProductSearchInputSchema,
    outputSchema: SmartProductSearchOutputSchema,
  },
  async input => {
    // In a real implementation, you would fetch the list of available products from a database or other source.
    // For this example, we'll use a hardcoded list.
    const availableProducts = [
      'Orange T-Shirt',
      'Orange Dress',
      'Light Orange Sweater',
      'Dark Blue Jeans',
      'Black Pants',
      'Running Shoes',
    ];

    // Add the available products to the prompt input.
    const promptInput = {
      ...input,
      availableProducts: availableProducts.join(', '),
    };

    const {output} = await prompt(promptInput);
    return output!;
  }
);
