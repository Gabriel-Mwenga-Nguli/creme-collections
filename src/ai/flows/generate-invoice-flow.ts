
'use server';
/**
 * @fileOverview An AI flow for generating branded invoices and email notifications.
 * This flow also saves an invoice record to the user's profile in Firestore.
 *
 * - generateInvoiceEmail - A function that creates the invoice and email content.
 * - GenerateInvoiceInput - The input type for the function.
 * - GenerateInvoiceOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { SITE_NAME } from '@/lib/constants';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


const InvoiceItemSchema = z.object({
  name: z.string().describe("The name of the product."),
  quantity: z.number().describe("The quantity of the product ordered."),
  priceAtPurchase: z.number().describe("The price of a single unit of the product at the time of purchase."),
});

const GenerateInvoiceInputSchema = z.object({
  orderId: z.string().describe("The unique identifier for the order."),
  userId: z.string().describe("The unique Firestore user ID for the customer."),
  customerName: z.string().describe("The name of the customer."),
  customerEmail: z.string().email().describe("The email address of the customer."),
  items: z.array(InvoiceItemSchema).describe("An array of items in the order."),
  totalAmount: z.number().describe("The total amount paid for the order."),
  orderDate: z.string().describe("The date the order was placed, in a readable format."),
  shippingAddress: z.string().describe("The customer's full shipping address, formatted as a single string."),
});
export type GenerateInvoiceInput = z.infer<typeof GenerateInvoiceInputSchema>;

const GenerateInvoiceOutputSchema = z.object({
  subject: z.string().describe("The subject line for the confirmation email."),
  htmlBody: z.string().describe("The full HTML content of the email, including the branded invoice."),
  customerEmail: z.string().email(), // Pass email through for convenience
});
export type GenerateInvoiceOutput = z.infer<typeof GenerateInvoiceOutputSchema>;


export async function generateInvoiceEmail(input: GenerateInvoiceInput): Promise<GenerateInvoiceOutput> {
  return generateInvoiceEmailFlow(input);
}

const invoicePrompt = ai.definePrompt({
  name: 'generateInvoiceEmailPrompt',
  input: { schema: GenerateInvoiceInputSchema },
  output: { schema: GenerateInvoiceOutputSchema },
  prompt: `
You are a professional and friendly order fulfillment assistant for an e-commerce store called "${SITE_NAME}".
Your task is to generate a branded order confirmation email in HTML format.

**Instructions:**
1.  Create a welcoming and reassuring email body. Confirm that the payment has been received and the order is now being processed.
2.  The email subject should be clear and professional, like "Your ${SITE_NAME} Order Confirmation [{{{orderId}}}]".
3.  Generate a clean, well-structured HTML invoice table within the email. The table should include: Item, Quantity, Unit Price, and Total Price for each item.
4.  Calculate the subtotal for each line item (Quantity * Unit Price).
5.  Include the final total amount.
6.  Include the customer's shipping address.
7.  Use inline CSS for styling to ensure maximum compatibility with email clients. The branding should be modern and clean, using a color palette of orange (primary: #f97316), dark gray (text: #333333), and light gray (backgrounds: #f7f7f7).
8.  The entire output must be a single block of HTML code for the 'htmlBody' field.
9. Also return the customerEmail field from the input.

**Order Details:**
- Order ID: {{{orderId}}}
- Customer Name: {{{customerName}}}
- Order Date: {{{orderDate}}}
- Shipping Address: {{{shippingAddress}}}
- Items:
  {{#each items}}
  - {{name}} (Qty: {{quantity}}, Unit Price: KES {{priceAtPurchase}})
  {{/each}}
- Grand Total: KES {{{totalAmount}}}

**Expected HTML Structure Example (use this as a guide for structure and styling):**
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Basic styles - inline them in the final output */
    body { font-family: Arial, sans-serif; }
    .container { padding: 20px; background-color: #f7f7f7; }
    .content { background-color: #ffffff; padding: 30px; border-radius: 8px; }
    .header { text-align: center; margin-bottom: 20px; }
    .header h1 { color: #f97316; }
    .invoice-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .invoice-table th, .invoice-table td { border: 1px solid #dddddd; text-align: left; padding: 8px; }
    .invoice-table th { background-color: #f2f2f2; color: #333333; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777777; }
  </style>
</head>
<body>
  ...
</body>
</html>
\`\`\`
Please generate the complete HTML for the 'htmlBody' field and a suitable 'subject' field based on the instructions.
`,
});

const generateInvoiceEmailFlow = ai.defineFlow(
  {
    name: 'generateInvoiceEmailFlow',
    inputSchema: GenerateInvoiceInputSchema,
    outputSchema: GenerateInvoiceOutputSchema,
  },
  async (input) => {
    const { output: emailOutput } = await invoicePrompt(input);
    if (!emailOutput) {
      throw new Error("AI could not generate an invoice email.");
    }
    
    // Save a record of the invoice to the user's subcollection in Firestore
    const invoiceRecord = {
        invoiceId: `INV-${input.orderId}`,
        orderId: input.orderId,
        totalAmount: input.totalAmount,
        invoiceDate: serverTimestamp(),
        status: 'Paid',
        subject: emailOutput.subject,
    };

    try {
        const invoicesRef = collection(db, `users/${input.userId}/invoices`);
        await addDoc(invoicesRef, invoiceRecord);
        console.log(`Invoice record saved for user ${input.userId}`);
    } catch (error) {
        console.error("Error saving invoice record to Firestore: ", error);
        // We don't throw an error here because the primary function (email generation) succeeded.
        // We just log the error.
    }
    
    return emailOutput;
  }
);
