import { config } from 'dotenv';
config();

import '@/ai/flows/generate-initial-tests.ts';
import '@/ai/flows/refine-generated-tests.ts';
import '@/ai/flows/optimize-test-coverage.ts';
import '@/ai/flows/resolve-build-issues.ts';