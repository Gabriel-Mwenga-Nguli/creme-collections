
'use server';
/**
 * @fileOverview An AI flow for generating personalized gift card content.
 * - generateGiftCardContent - Creates a personalized message and an image prompt.
 * - GenerateGiftCardContentInput - Input type for the function.
 * - GenerateGiftCardContentOutput - Output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateGiftCardContentInputSchema = z.object({
  recipientName: z.string().describe('The name of the person receiving the gift card.'),
  senderName: z.string().describe('The name of the person giving the gift card.'),
  occasion: z.string().describe('The occasion for the gift (e.g., Birthday, Thank You, Christmas).'),
  amount: z.number().describe('The amount of the gift card in KES.'),
});
export type GenerateGiftCardContentInput = z.infer<typeof GenerateGiftCardContentInputSchema>;

const GenerateGiftCardContentOutputSchema = z.object({
  message: z.string().describe('A heartfelt, personalized message for the gift card.'),
  designPrompt: z.string().describe('A descriptive prompt for an AI image generator to create a visual for the gift card. The prompt should be concise, focusing on objects and themes, avoiding text.'),
});
export type GenerateGiftCardContentOutput = z.infer<typeof GenerateGiftCardContentOutputSchema>;

export async function generateGiftCardContent(
  input: GenerateGiftCardContentInput
): Promise<GenerateGiftCardContentOutput> {
  return generateGiftCardContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGiftCardContentPrompt',
  input: { schema: GenerateGiftCardContentInputSchema },
  output: { schema: GenerateGiftCardContentOutputSchema },
  prompt: `You are a creative assistant for Creme Collections, an e-commerce store.
Your task is to generate content for a digital gift card.

**Context:**
- Sender: {{{senderName}}}
- Recipient: {{{recipientName}}}
- Occasion: {{{occasion}}}
- Amount: KES {{{amount}}}

**Instructions:**
1.  **Write a Message:** Create a short, warm, and friendly message (around 20-30 words) for {{{recipientName}}} from {{{senderName}}}. The tone should match the "{{{occasion}}}" and mention the gift of shopping at Creme Collections.
2.  **Create a Design Prompt:** Generate a simple, elegant, and descriptive prompt for an AI image generator. The prompt should be based on the "{{{occasion}}}".
    - It must be concise (4-8 words).
    - It must focus on visual elements and themes (e.g., "elegant gift box ribbon", "birthday cake candles", "serene holiday landscape").
    - **Crucially, DO NOT include any text, letters, or words in the image prompt.** The AI should only generate an image.

Please provide the output in the specified JSON format.
`,
});

const generateGiftCardContentFlow = ai.defineFlow(
  {
    name: 'generateGiftCardContentFlow',
    inputSchema: GenerateGiftCardContentInputSchema,
    outputSchema: GenerateGiftCardContentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI could not generate gift card content.');
    }
    return output;
  }
);
