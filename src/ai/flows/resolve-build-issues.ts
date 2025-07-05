'use server';

/**
 * @fileOverview Analyzes build logs using an LLM to identify errors, suggest fixes based on YAML guidelines, and helps resolve build issues automatically.
 *
 * - resolveBuildIssues - A function that handles the build issue resolution process.
 * - ResolveBuildIssuesInput - The input type for the resolveBuildIssues function.
 * - ResolveBuildIssuesOutput - The return type for the resolveBuildIssues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResolveBuildIssuesInputSchema = z.object({
  buildLogs: z
    .string()
    .describe('The complete build logs of the C++ project.'),
  cppCode: z.string().describe('The C++ code that caused the build issues.'),
  yamlGuidelines: z
    .string()
    .describe('YAML guidelines for fixing the build issues.'),
});
export type ResolveBuildIssuesInput = z.infer<typeof ResolveBuildIssuesInputSchema>;

const ResolveBuildIssuesOutputSchema = z.object({
  fixedCode: z
    .string()
    .describe('The corrected C++ code with the build issues resolved.'),
  explanation: z
    .string()
    .describe('An explanation of the changes made to fix the build issues.'),
});
export type ResolveBuildIssuesOutput = z.infer<typeof ResolveBuildIssuesOutputSchema>;

export async function resolveBuildIssues(input: ResolveBuildIssuesInput): Promise<ResolveBuildIssuesOutput> {
  return resolveBuildIssuesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resolveBuildIssuesPrompt',
  input: {schema: ResolveBuildIssuesInputSchema},
  output: {schema: ResolveBuildIssuesOutputSchema},
  prompt: `You are an expert C++ developer specializing in resolving build issues.

You will analyze the provided C++ code and build logs, and use the YAML guidelines to fix the build issues.

C++ Code:
{{cppCode}}

Build Logs:
{{buildLogs}}

YAML Guidelines:
{{yamlGuidelines}}

Based on the above information, identify the errors in the C++ code, correct them according to the YAML guidelines, and provide an explanation of the changes you made. Return the fixed C++ code and the explanation.

Ensure that the fixed code compiles without errors and follows the best practices for C++ development.
`,
});

const resolveBuildIssuesFlow = ai.defineFlow(
  {
    name: 'resolveBuildIssuesFlow',
    inputSchema: ResolveBuildIssuesInputSchema,
    outputSchema: ResolveBuildIssuesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
