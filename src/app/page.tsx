"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Sparkles,
  TestTube2,
  Wrench,
  Target,
  ClipboardCopy,
} from "lucide-react";

import { generateInitialTests } from "@/ai/flows/generate-initial-tests";
import { refineGeneratedTests } from "@/ai/flows/refine-generated-tests";
import { resolveBuildIssues } from "@/ai/flows/resolve-build-issues";
import { optimizeTestCoverage } from "@/ai/flows/optimize-test-coverage";

const sampleCppCode = `// calculator.h
class Calculator {
public:
    int add(int a, int b);
    int subtract(int a, int b);
    int multiply(int a, int b);
    int divide(int a, int b);
};

// calculator.cpp
#include "calculator.h"
#include <stdexcept>

int Calculator::add(int a, int b) {
    return a + b;
}

int Calculator::subtract(int a, int b) {
    return a - b;
}

int Calculator::multiply(int a, int b) {
    return a * b;
}

int Calculator::divide(int a, int b) {
    if (b == 0) {
        throw std::invalid_argument("Division by zero");
    }
    return a / b;
}
`;

const sampleYamlInstructions = `framework: "GoogleTest"
tests:
  - function: "add"
    cases:
      - name: "test_add_positive"
        inputs: [2, 3]
        expected: 5
      - name: "test_add_negative"
        inputs: [-2, -3]
        expected: -5
  - function: "subtract"
    cases:
      - name: "test_subtract_positive"
        inputs: [5, 3]
        expected: 2
  - function: "divide"
    cases:
      - name: "test_divide_by_zero"
        inputs: [5, 0]
        expect_throw: true
`;

export default function Home() {
  const [cppCode, setCppCode] = useState(sampleCppCode);
  const [yamlInstructions, setYamlInstructions] = useState(sampleYamlInstructions);
  const [generatedTests, setGeneratedTests] = useState("");
  const [buildLogs, setBuildLogs] = useState("");
  const [coverageReport, setCoverageReport] = useState("");
  const [aiAnalysisOutput, setAiAnalysisOutput] = useState("");
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState("ai-analysis");
  const [currentStage, setCurrentStage] = useState<"initial" | "generated">("initial");

  const { toast } = useToast();

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  const handleAiOperation = async (
    operation: () => Promise<any>,
    operationName: string,
    successMessage: string,
    errorMessage: string
  ) => {
    setIsLoading(prev => ({ ...prev, [operationName]: true }));
    try {
      const result = await operation();
      setCurrentStage("generated");
      toast({ title: "Success", description: successMessage });
      return result;
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: errorMessage });
    } finally {
      setIsLoading(prev => ({ ...prev, [operationName]: false }));
    }
  };

  const handleGenerate = async () => {
    const result = await handleAiOperation(
      () => generateInitialTests({ cppCode, yamlInstructions, testsFolderName: 'tests' }),
      'generate',
      'Initial tests generated successfully.',
      'Failed to generate initial tests.'
    );
    if (result) {
      setGeneratedTests(result.generatedTests);
      setAiAnalysisOutput("Generated initial tests. You can now refine them or run a build.");
      setActiveTab("ai-analysis");
    }
  };
  
  const handleRefine = async () => {
    const result = await handleAiOperation(
      () => refineGeneratedTests({ cppCode, generatedTests, yamlConfig: yamlInstructions, buildLogs }),
      'refine',
      'Tests refined successfully.',
      'Failed to refine tests.'
    );
    if (result) {
      setGeneratedTests(result.refinedTests);
      setAiAnalysisOutput(`## Refinement Report\n\n${result.report}`);
      setActiveTab("ai-analysis");
    }
  };
  
  const handleFixBuild = async () => {
    const result = await handleAiOperation(
      () => resolveBuildIssues({ cppCode: generatedTests, buildLogs, yamlGuidelines: yamlInstructions }),
      'fix',
      'Build issues fixed successfully.',
      'Failed to fix build issues.'
    );
    if (result) {
      setGeneratedTests(result.fixedCode);
      setAiAnalysisOutput(`## Build Fix Explanation\n\n${result.explanation}`);
      setActiveTab("ai-analysis");
    }
  };
  
  const handleOptimize = async () => {
    const result = await handleAiOperation(
      () => optimizeTestCoverage({ cppCode, coverageReport, yamlInstructions }),
      'optimize',
      'Test coverage optimized successfully.',
      'Failed to optimize test coverage.'
    );
    if (result) {
      setGeneratedTests(result.formattedTests);
      setAiAnalysisOutput(`## Coverage Optimization Suggestions\n\n${result.suggestions}`);
      setActiveTab("ai-analysis");
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-6 px-4 md:px-8 border-b shadow-sm">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold font-headline text-primary">
            C++ Unit Test Alchemist
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate, refine, and optimize C++ unit tests with the power of AI.
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-8">
            {/* C++ and YAML Input Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">1. Provide Inputs</CardTitle>
                <CardDescription>
                  Enter your C++ source code and YAML instructions to guide the AI.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="cpp-code" className="font-medium text-lg mb-2 block">
                    C++ Source Code
                  </Label>
                  <Textarea
                    id="cpp-code"
                    value={cppCode}
                    onChange={(e) => setCppCode(e.target.value)}
                    className="font-code text-sm h-64 bg-secondary/30"
                    placeholder="Paste your C++ code here..."
                  />
                </div>
                <div>
                  <Label htmlFor="yaml-instructions" className="font-medium text-lg mb-2 block">
                    YAML Instructions
                  </Label>
                  <Textarea
                    id="yaml-instructions"
                    value={yamlInstructions}
                    onChange={(e) => setYamlInstructions(e.target.value)}
                    className="font-code text-sm h-64 bg-secondary/30"
                    placeholder="Provide YAML instructions..."
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleGenerate} disabled={isLoading['generate'] || !cppCode || !yamlInstructions} size="lg">
                  {isLoading['generate'] ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Initial Tests
                </Button>
              </CardFooter>
            </Card>

            {/* Workflow Controls Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">2. Refine & Optimize</CardTitle>
                <CardDescription>
                  Use the generated tests and feedback to iteratively improve your test suite.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button onClick={handleRefine} disabled={isLoading['refine'] || currentStage === 'initial'} variant="secondary">
                  {isLoading['refine'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TestTube2 className="mr-2 h-4 w-4" />}
                  Refine Tests
                </Button>
                <Button onClick={handleFixBuild} disabled={isLoading['fix'] || currentStage === 'initial' || !buildLogs} variant="destructive">
                  {isLoading['fix'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wrench className="mr-2 h-4 w-4" />}
                  Fix Build
                </Button>
                <Button onClick={handleOptimize} disabled={isLoading['optimize'] || currentStage === 'initial' || !coverageReport} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {isLoading['optimize'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Target className="mr-2 h-4 w-4" />}
                  Optimize
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-8">
            {/* Generated Tests Output Card */}
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-headline text-2xl">Generated Unit Tests</CardTitle>
                  <CardDescription>Review and modify the AI-generated tests.
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedTests)} disabled={!generatedTests}>
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generatedTests}
                  onChange={(e) => setGeneratedTests(e.target.value)}
                  className="font-code text-sm h-[400px] bg-secondary/30"
                  placeholder="Your generated tests will appear here..."
                />
              </CardContent>
            </Card>

            {/* Analysis & Results Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Analysis & Results</CardTitle>
                <CardDescription>
                  Provide build logs and coverage reports to fuel the AI's refinement process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="build-logs">Build Logs</TabsTrigger>
                    <TabsTrigger value="coverage">Coverage</TabsTrigger>
                    <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
                  </TabsList>
                  <TabsContent value="build-logs" className="mt-4">
                     <Textarea
                      placeholder="Paste build logs here to enable the 'Fix Build' feature."
                      value={buildLogs}
                      onChange={(e) => setBuildLogs(e.target.value)}
                      className="font-code text-xs h-48 bg-secondary/30"
                    />
                  </TabsContent>
                  <TabsContent value="coverage" className="mt-4">
                     <Textarea
                      placeholder="Paste your coverage report to enable the 'Optimize' feature."
                      value={coverageReport}
                      onChange={(e) => setCoverageReport(e.target.value)}
                      className="font-code text-xs h-48 bg-secondary/30"
                    />
                  </TabsContent>
                  <TabsContent value="ai-analysis" className="mt-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none p-4 rounded-md bg-secondary/30 h-48 overflow-y-auto">
                      <pre className="font-code text-xs whitespace-pre-wrap bg-transparent p-0 m-0">{aiAnalysisOutput || "AI analysis and suggestions will appear here."}</pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
