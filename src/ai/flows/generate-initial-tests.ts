// use server'
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating initial unit tests for C++ code.
 *
 * It takes C++ source code and YAML instructions as input, then uses an LLM to generate unit tests.
 * The generated tests are saved in a designated tests folder.
 *
 * @exports generateInitialTests - A function to trigger the unit test generation flow.
 * @exports GenerateInitialTestsInput - The input type for the generateInitialTests function.
 * @exports GenerateInitialTestsOutput - The return type for the generateInitialTests function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the generateInitialTests flow.
 */
const GenerateInitialTestsInputSchema = z.object({
  cppCode: z.string().describe('The C++ source code to generate unit tests for.'),
  yamlInstructions: z.string().describe('YAML instructions to guide the unit test generation.'),
  testsFolderName: z.string().default('tests').describe('The name of the folder to save the generated tests in.'),
});

export type GenerateInitialTestsInput = z.infer<typeof GenerateInitialTestsInputSchema>;

/**
 * Output schema for the generateInitialTests flow.
 */
const GenerateInitialTestsOutputSchema = z.object({
  generatedTests: z.string().describe('The generated unit tests as a string.'),
});

export type GenerateInitialTestsOutput = z.infer<typeof GenerateInitialTestsOutputSchema>;

/**
 * Wrapper function to call the generateInitialTestsFlow.
 * @param input - The input for the flow.
 * @returns The output of the flow, containing the generated unit tests.
 */
export async function generateInitialTests(input: GenerateInitialTestsInput): Promise<GenerateInitialTestsOutput> {
  return generateInitialTestsFlow(input);
}

/**
 * Prompt definition for generating initial unit tests.
 */
const generateInitialTestsPrompt = ai.definePrompt({
  name: 'generateInitialTestsPrompt',
  input: {schema: GenerateInitialTestsInputSchema},
  output: {schema: GenerateInitialTestsOutputSchema},
  prompt: `You are a C++ unit test generator. You will receive C++ source code and YAML instructions.
Your task is to generate initial unit tests based on the provided code and instructions.

C++ Source Code:
{{cppCode}}

YAML Instructions:
{{yamlInstructions}}

Generated tests should be saved in the '{{testsFolderName}}' folder.

Ensure the generated tests are well-structured, cover the main functionalities of the code,
and are compatible with a standard C++ testing framework (e.g., Google Test). Return the complete content of generated test files.
`,
});

/**
 * Genkit flow definition for generating initial unit tests.
 */
const generateInitialTestsFlow = ai.defineFlow(
  {
    name: 'generateInitialTestsFlow',
    inputSchema: GenerateInitialTestsInputSchema,
    outputSchema: GenerateInitialTestsOutputSchema,
  },
  async input => {
    const {output} = await generateInitialTestsPrompt(input);
    return output!;
  }
);
