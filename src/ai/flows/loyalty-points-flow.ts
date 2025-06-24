
'use server';
/**
 * @fileOverview An AI-powered loyalty points management system.
 *
 * - manageLoyaltyPoints - A function to calculate and update user loyalty points.
 * - LoyaltyPointsInput - The input type for the manageLoyaltyPoints function.
 * - LoyaltyPointsOutput - The return type for the manageLoyaltyPoints function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LoyaltyPointsInputSchema = z.object({
  userId: z.string().describe('The unique identifier of the user.'),
  activityType: z.enum(['purchase', 'review', 'signup', 'referral', 'milestone', 'manual_adjustment', 'profile_update']) // Added 'profile_update'
    .describe('The type of activity for which points are being awarded or deducted.'),
  activityValue: z.number().optional().describe('A value associated with the activity, e.g., purchase amount, review rating. Not always required.'),
  reason: z.string().optional().describe('A specific reason for manual adjustments or special point awards.'),
});
export type LoyaltyPointsInput = z.infer<typeof LoyaltyPointsInputSchema>;

const LoyaltyPointsOutputSchema = z.object({
  userId: z.string(),
  previousPoints: z.number(),
  pointsChange: z.number(),
  newTotalPoints: z.number(),
  message: z.string().describe('A message describing the points transaction.'),
});
export type LoyaltyPointsOutput = z.infer<typeof LoyaltyPointsOutputSchema>;

export async function manageLoyaltyPoints(input: LoyaltyPointsInput): Promise<LoyaltyPointsOutput> {
  return loyaltyPointsFlow(input);
}

const loyaltyPointsPrompt = ai.definePrompt({
  name: 'loyaltyPointsPrompt',
  input: { schema: z.object({
      currentPoints: z.number(),
      activityType: LoyaltyPointsInputSchema.shape.activityType,
      activityValue: LoyaltyPointsInputSchema.shape.activityValue,
      reason: LoyaltyPointsInputSchema.shape.reason,
      userSegment: z.string().optional().describe("User segment like 'new', 'regular', 'vip' for tailored point logic.")
  })},
  output: { schema: z.object({
      pointsToAwardOrDeduct: z.number().describe("Calculated points. Positive for award, negative for deduction."),
      calculationReasoning: z.string().describe("Brief explanation of how points were calculated.")
  })},
  prompt: `You are an AI assistant for calculating loyalty points for "Creme Collections".
Current User Points: {{{currentPoints}}}
Activity Type: {{{activityType}}}
{{#if activityValue}}Activity Value: {{{activityValue}}}{{/if}}
{{#if reason}}Reason for adjustment: {{{reason}}}{{/if}}
{{#if userSegment}}User Segment: {{{userSegment}}}{{/if}}

Based on the activity, calculate the points to be awarded or deducted.
- Purchases: Award 1 point for every KES 100 spent (e.g., KES 1500 purchase = 15 points).
- Review: Award 50 points for a product review.
- Signup: Award 100 points for new user signup.
- Referral: Award 200 points for successful referral.
- Milestone: (e.g., 1 year anniversary, 10th purchase) - Award 150 points.
- Profile Update: Award 25 points for updating profile information.
- Manual Adjustment: Use the activityValue directly as pointsToAwardOrDeduct if reason is provided.

Prioritize 'manual_adjustment' if reason is present and a specific 'activityValue' is provided for it.
If 'activityType' is 'profile_update', award exactly 25 points. The 'activityValue' for 'profile_update' can be ignored.
If activityValue is not applicable for other activity types (e.g. review, signup), use a default point value for that activity.
Provide a brief reasoning for your calculation.
`,
});

const loyaltyPointsFlow = ai.defineFlow(
  {
    name: 'loyaltyPointsFlow',
    inputSchema: LoyaltyPointsInputSchema,
    outputSchema: LoyaltyPointsOutputSchema,
  },
  async (input) => {
    // Firestore logic removed. Using mock data.
    console.log("[DEV MODE] Firestore is disabled. Using mock data for loyalty points.");
    const currentPoints = 0; // Mock current points
    const userSegment = 'new'; // Mock user segment

    const promptInputForAI = {
        currentPoints,
        activityType: input.activityType,
        activityValue: input.activityValue,
        reason: input.reason,
        userSegment,
    };

    const { output: aiDecision } = await loyaltyPointsPrompt(promptInputForAI);
    if (!aiDecision) {
        throw new Error("AI could not determine points adjustment.");
    }

    const pointsChange = aiDecision.pointsToAwardOrDeduct;
    const newTotalPoints = currentPoints + pointsChange;

    // Skip saving to Firestore
    console.log(`[DEV MODE] Skipping saving loyalty points for user ${input.userId} to Firestore.`);

    return {
      userId: input.userId,
      previousPoints: currentPoints,
      pointsChange,
      newTotalPoints,
      message: `[MOCK] User ${input.userId} ${pointsChange >= 0 ? 'awarded' : 'deducted'} ${Math.abs(pointsChange)} points. New total: ${newTotalPoints}. Reason: ${aiDecision.calculationReasoning}`,
    };
  }
);
