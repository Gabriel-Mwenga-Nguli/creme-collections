
'use server';
/**
 * @fileOverview AI flow to draft a support message based on user topic.
 *
 * - draftSupportMessage - Function to generate a support message draft.
 * - DraftSupportMessageInput - Input type for the flow.
 * - DraftSupportMessageOutput - Output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const DraftSupportMessageInputSchema = z.object({
  topic: z.string().describe('The user main topic or issue they want to write about.'),
  userEmail: z.string().optional().describe('The email of the user writing the message, if available.'),
  // You could add more context here, like order ID, product name, if relevant
});
export type DraftSupportMessageInput = z.infer<typeof DraftSupportMessageInputSchema>;

export const DraftSupportMessageOutputSchema = z.object({
  draftMessage: z.string().describe('The AI-generated draft message for the user to send to support.'),
  suggestedSubject: z.string().optional().describe('An AI-suggested subject line for the email.'),
});
export type DraftSupportMessageOutput = z.infer<typeof DraftSupportMessageOutputSchema>;

export async function draftSupportMessage(input: DraftSupportMessageInput): Promise<DraftSupportMessageOutput> {
  return draftSupportMessageFlow(input);
}

const draftPrompt = ai.definePrompt({
  name: 'draftSupportMessagePrompt',
  input: {schema: DraftSupportMessageInputSchema},
  output: {schema: DraftSupportMessageOutputSchema},
  prompt: `You are an AI assistant helping a user draft a message to customer support for an e-commerce website called "Creme Collections".
The user wants to write about the following topic: {{{topic}}}
{{#if userEmail}}The user's email is {{{userEmail}}}{{/if}}

Please draft a polite, clear, and concise message that the user can send.
The message should accurately reflect their topic.
If the topic is a question, ensure the draft asks the question clearly.
If the topic is an issue, ensure the draft describes the issue clearly.
Suggest a suitable subject line for this message.

Keep the tone professional and helpful.
Structure the output as JSON with "draftMessage" and "suggestedSubject" fields.

Example for a question about a product:
Topic: "Enquiring about the warranty for the Smartwatch X200"
Draft Message:
"Dear Creme Collections Support,

I hope this email finds you well.

I am writing to inquire about the warranty details for the Smartwatch X200 that I saw on your website. Could you please provide information on the warranty period and what it covers?

My email is [user's email if provided, otherwise omit this line or use a placeholder].

Thank you for your time and assistance.

Sincerely,
[User's Name (placeholder, as we don't have it)]"
Suggested Subject: "Inquiry about Smartwatch X200 Warranty"

Example for an issue:
Topic: "My recent order #12345 arrived with a damaged item."
Draft Message:
"Dear Creme Collections Support,

I am writing to report an issue with my recent order, #12345. Upon receiving the package, I found that one of the items, [Item Name if user specified, otherwise 'an item'], was damaged.

[User can add more details here about the damage].

Could you please advise on how to proceed with a replacement or refund? My email is [user's email if provided].

Thank you for your assistance.

Regards,
[User's Name (placeholder)]"
Suggested Subject: "Issue with Damaged Item in Order #12345"

User's current topic: {{{topic}}}
`,
});

const draftSupportMessageFlow = ai.defineFlow(
  {
    name: 'draftSupportMessageFlow',
    inputSchema: DraftSupportMessageInputSchema,
    outputSchema: DraftSupportMessageOutputSchema,
  },
  async (input) => {
    const { output } = await draftPrompt(input);
    if (!output) {
        throw new Error("AI could not generate a draft message.");
    }
    // Simple placeholder for user name if not directly available in input
    // In a real scenario, user's name might be part of the input or fetched
    const userNamePlaceholder = "[Your Name]";
    output.draftMessage = output.draftMessage.replace(/\[User's Name \(placeholder\)\]/g, userNamePlaceholder);
    output.draftMessage = output.draftMessage.replace(/\[User's Name \(placeholder, as we don't have it\)\]/g, userNamePlaceholder);


    if (input.userEmail) {
         output.draftMessage = output.draftMessage.replace(/\[user's email if provided, otherwise omit this line or use a placeholder\]/gi, `My email is ${input.userEmail}.`);
         output.draftMessage = output.draftMessage.replace(/My email is \[user's email if provided\]./gi, `My email is ${input.userEmail}.`);
    } else {
        // Remove the email line if no email provided
        output.draftMessage = output.draftMessage.replace(/My email is \[user's email if provided, otherwise omit this line or use a placeholder\]\.\s*\n?/gi, '');
        output.draftMessage = output.draftMessage.replace(/My email is \[user's email if provided\]\.\s*\n?/gi, '');
    }


    return output;
  }
);
