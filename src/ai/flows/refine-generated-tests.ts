// refine-generated-tests.ts
'use server';
/**
 * @fileOverview Refines initially generated C++ unit tests using an LLM.
 *
 * This flow analyzes the tests to remove duplicates, add libraries, and improve quality.
 *
 * @interface RefineGeneratedTestsInput - Input for refining generated tests.
 * @interface RefineGeneratedTestsOutput - Output containing the refined tests.
 * @function refineGeneratedTests - Main function to refine generated tests.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineGeneratedTestsInputSchema = z.object({
  cppCode: z.string().describe('The original C++ source code.'),
  generatedTests: z.string().describe('The initially generated unit tests.'),
  yamlConfig: z.string().describe('YAML configuration for test refinement.'),
  buildLogs: z.string().optional().describe('Optional build logs for error analysis.'),
});

export type RefineGeneratedTestsInput = z.infer<typeof RefineGeneratedTestsInputSchema>;

const RefineGeneratedTestsOutputSchema = z.object({
  refinedTests: z.string().describe('The refined unit tests.'),
  report: z.string().optional().describe('A report summarizing the changes made.'),
});

export type RefineGeneratedTestsOutput = z.infer<typeof RefineGeneratedTestsOutputSchema>;

export async function refineGeneratedTests(input: RefineGeneratedTestsInput): Promise<RefineGeneratedTestsOutput> {
  return refineGeneratedTestsFlow(input);
}

const refineGeneratedTestsPrompt = ai.definePrompt({
  name: 'refineGeneratedTestsPrompt',
  input: {schema: RefineGeneratedTestsInputSchema},
  output: {schema: RefineGeneratedTestsOutputSchema},
  prompt: `You are a C++ unit test expert. Given the following C++ code, initial unit tests, YAML configuration, and optional build logs, refine the unit tests to remove duplicates, add necessary libraries, and improve overall quality.\n\nC++ Code:\n{{{cppCode}}}\n\nInitial Unit Tests:\n{{{generatedTests}}}\n\nYAML Configuration:\n{{{yamlConfig}}}\n\nBuild Logs (if any):\n{{{buildLogs}}}\n\nOutput the refined unit tests and a report summarizing the changes made. The refined tests should be compilable and effectively test the C++ code.`,
});

const refineGeneratedTestsFlow = ai.defineFlow(
  {
    name: 'refineGeneratedTestsFlow',
    inputSchema: RefineGeneratedTestsInputSchema,
    outputSchema: RefineGeneratedTestsOutputSchema,
  },
  async input => {
    const {output} = await refineGeneratedTestsPrompt(input);
    return output!;
  }
);
