
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
import { getAllProducts, type Product } from '@/services/productService';

// Define a Zod schema that matches the Product interface for robust type checking.
const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  longDescription: z.string().optional(),
  image: z.string(),
  images: z.array(z.string()).optional(),
  dataAiHint: z.string(),
  offerPrice: z.number(),
  originalPrice: z.number().optional(),
  rating: z.union([z.string(), z.number()]).optional(),
  reviewsCount: z.number().optional(),
  availability: z.string().optional(),
  category: z.string().optional(),
  categorySlug: z.string().optional(),
  subCategory: z.string().optional(),
  subCategorySlug: z.string().optional(),
  brand: z.string().optional(),
  stock: z.number().optional(),
  isFeatured: z.boolean().optional(),
  isWeeklyDeal: z.boolean().optional(),
  createdAt: z.date().optional(),
});


const SmartProductSearchInputSchema = z.object({
  searchTerm: z.string().describe('The search term entered by the user.'),
});
export type SmartProductSearchInput = z.infer<typeof SmartProductSearchInputSchema>;

// Update output schema to return an array of full product objects
const SmartProductSearchOutputSchema = z.object({
  products: z
    .array(ProductSchema) // Use the new product schema
    .describe('A list of relevant products based on the search term.'),
  reasoning: z.string().describe('Explanation of why these products were returned.'),
});
export type SmartProductSearchOutput = z.infer<typeof SmartProductSearchOutputSchema>;

export async function smartProductSearch(input: SmartProductSearchInput): Promise<SmartProductSearchOutput> {
  return smartProductSearchFlow(input);
}

// Update prompt to handle full product data
const prompt = ai.definePrompt({
  name: 'smartProductSearchPrompt',
  input: { schema: z.object({ searchTerm: z.string(), availableProductsJson: z.string() }) }, // Pass products as JSON string
  output: { schema: SmartProductSearchOutputSchema },
  prompt: `You are an intelligent e-commerce search assistant.
A user is searching for: "{{{searchTerm}}}"

Here is a list of all available products in JSON format:
{{{availableProductsJson}}}

Your task is to:
1.  Analyze the user's search term. The term could be a product name, a description, a category, a brand, or even a feature.
2.  Filter the provided JSON list to find the products that are most relevant to the search term.
3.  Return a JSON object containing a 'products' array with the full product objects of the relevant items, and a 'reasoning' string explaining your choices.
4.  If no products are relevant, return an empty 'products' array.
`,
});

const smartProductSearchFlow = ai.defineFlow(
  {
    name: 'smartProductSearchFlow',
    inputSchema: SmartProductSearchInputSchema,
    outputSchema: SmartProductSearchOutputSchema,
  },
  async input => {
    // Fetch all products from the service
    const availableProducts: Product[] = await getAllProducts();
    
    // The date objects can't be directly stringified for the prompt, so we'll convert them
    const sanitizedProducts = availableProducts.map(p => ({
        ...p,
        createdAt: p.createdAt?.toISOString(), // Convert Date to string
    }));

    // Add the available products to the prompt input as a JSON string
    const promptInput = {
      searchTerm: input.searchTerm,
      availableProductsJson: JSON.stringify(sanitizedProducts, null, 2),
    };

    const { output } = await prompt(promptInput);
    if (!output) {
      return { products: [], reasoning: 'AI failed to process the search.' };
    }
    return output;
  }
);
