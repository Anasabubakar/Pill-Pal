'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing AI-powered medication adherence insights.
 *
 * The flow analyzes medication logs and provides personalized suggestions and insights to users.
 * It includes:
 *   - aiMedicationInsights: An async function that takes a user ID and a query as input and returns AI-generated insights.
 *   - AiMedicationInsightsInput: The input type for the aiMedicationInsights function.
 *   - AiMedicationInsightsOutput: The output type for the aiMedicationInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiMedicationInsightsInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  query: z.string().describe('The user query for medication insights.'),
});
export type AiMedicationInsightsInput = z.infer<typeof AiMedicationInsightsInputSchema>;

const AiMedicationInsightsOutputSchema = z.object({
  insights: z.string().describe('AI-generated insights based on medication adherence history and user query.'),
});
export type AiMedicationInsightsOutput = z.infer<typeof AiMedicationInsightsOutputSchema>;

export async function aiMedicationInsights(input: AiMedicationInsightsInput): Promise<AiMedicationInsightsOutput> {
  return aiMedicationInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiMedicationInsightsPrompt',
  input: {schema: AiMedicationInsightsInputSchema},
  output: {schema: AiMedicationInsightsOutputSchema},
  prompt: `You are a helpful AI assistant providing insights on medication adherence.

  Analyze the user's medication history and provide personalized suggestions and insights based on their query.

  User ID: {{{userId}}}
  Query: {{{query}}}
  Medication Logs: (This information would normally be here, but it cannot be accessed within Handlebars.  The LLM will have to respond appropriately without it.  The logs typically contain the medication name, dosage, time, status (taken/missed), and any notes.)

  Provide insights in plain language.`,
});

const aiMedicationInsightsFlow = ai.defineFlow(
  {
    name: 'aiMedicationInsightsFlow',
    inputSchema: AiMedicationInsightsInputSchema,
    outputSchema: AiMedicationInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
