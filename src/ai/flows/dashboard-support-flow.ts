
'use server';
/**
 * @fileOverview An AI-powered dashboard support agent.
 *
 * - dashboardSupport - Handles customer support queries from the user dashboard.
 * - DashboardSupportInput - Input type for the dashboardSupport function.
 * - DashboardSupportOutput - Output type for the dashboardSupport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getUserOrders, type Order } from '@/services/orderService';
import { getUserProfile, type UserProfile } from '@/services/userService';

// Define tools for the AI to use
const getUserOrdersTool = ai.defineTool(
  {
    name: 'getUserOrdersTool',
    description: "Retrieves a summary of the user's past orders.",
    inputSchema: z.object({ userId: z.string() }),
    outputSchema: z.array(z.object({
        orderId: z.string().optional(),
        orderDate: z.date(),
        status: z.string(),
        totalAmount: z.number(),
    })),
  },
  async ({ userId }) => {
    const orders = await getUserOrders(userId);
    return orders.map(o => ({
        orderId: o.orderId || o.id,
        orderDate: new Date(o.orderDate.toString()),
        status: o.status,
        totalAmount: o.totalAmount,
    }));
  }
);

const getUserProfileTool = ai.defineTool(
    {
        name: 'getUserProfileTool',
        description: "Gets the user's profile information like name and email.",
        inputSchema: z.object({ userId: z.string() }),
        outputSchema: z.object({ name: z.string(), email: z.string() }).nullable(),
    },
    async ({ userId }) => {
        return await getUserProfile(userId);
    }
)

const DashboardSupportInputSchema = z.object({
  userId: z.string().describe('The unique ID of the user asking the question.'),
  message: z.string().describe('The user\'s current message.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The history of the conversation so far.'),
});
export type DashboardSupportInput = z.infer<typeof DashboardSupportInputSchema>;

const DashboardSupportOutputSchema = z.object({
  response: z.string().describe('The AI-generated answer to the user query.'),
});
export type DashboardSupportOutput = z.infer<typeof DashboardSupportOutputSchema>;

export async function dashboardSupport(input: DashboardSupportInput): Promise<DashboardSupportOutput> {
  return dashboardSupportFlow(input);
}

const dashboardSupportPrompt = ai.definePrompt({
  name: 'dashboardSupportPrompt',
  input: { schema: DashboardSupportInputSchema }, 
  output: { schema: DashboardSupportOutputSchema },
  tools: [getUserOrdersTool, getUserProfileTool],
  prompt: `You are a helpful and friendly AI account assistant for "Creme Collections".
Your primary role is to help the user with questions about their account, orders, and profile information.
Use the available tools to find information if needed.
The current user's ID is {{{userId}}}.
Today's date is {{currentDate}}.

Here is the conversation history so far (if any):
{{#if chatHistory}}
  {{#each chatHistory}}
    {{#if (eq role 'user')}}User: {{content}}{{/if}}
    {{#if (eq role 'model')}}Assistant: {{content}}{{/if}}
  {{/each}}
{{/if}}

Current user message: {{{message}}}

Your Task:
1.  Analyze the user's message in the context of the conversation history.
2.  If the user asks about their orders, profile, or any other information that a tool can provide, use the tool.
3.  Formulate a clear, concise, and friendly response based on the information you have or the information you retrieve from the tools.
4.  Do not make up information. If you cannot answer, politely say so.
5.  If you use tool data, present it in a readable format (e.g., use markdown for lists).

Respond to the user's current message now.`,
});

const dashboardSupportFlow = ai.defineFlow(
  {
    name: 'dashboardSupportFlow',
    inputSchema: DashboardSupportInputSchema,
    outputSchema: DashboardSupportOutputSchema,
  },
  async (input) => {
    const promptInput = {
      ...input,
      currentDate: new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    };

    const { output } = await dashboardSupportPrompt(promptInput);
    if (!output) {
      return { response: "I'm sorry, I encountered an issue and can't respond right now. Please try again in a moment." };
    }
    return output;
  }
);
