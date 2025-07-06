# Test Optimization AI Project

This project leverages AI to enhance the software testing process. It provides a set of tools and workflows to generate, optimize, and refine test cases, and assist in resolving build issues.

## ✨ Key Features

### ✅ Generate Initial Tests

Automatically analyze C++ or JavaScript/TypeScript codebases to:

* Identify functions, classes, and modules.
* Generate boilerplate unit tests using LLMs.
* Accelerate the creation of test suites with minimal effort.

### 📈 Optimize Test Coverage

* Analyze your test coverage using tools like **gcov**, **lcov**, or **Jest**.
* Identify untested or under-tested areas.
* Recommend and generate additional tests to improve overall coverage.

### 🔧 Refine Generated Tests

* Use AI models to inspect generated tests.
* Remove redundant cases and fix missing headers or mocks.
* Improve robustness, edge-case coverage, and readability.

### 🛠️ Resolve Build Issues

* Parse build logs for compilation or linking errors.
* Leverage AI to diagnose root causes.
* Suggest code fixes or library installations to resolve issues quickly.


<h2>💻 Tech Stack</h2>

<table border="1" cellpadding="6" cellspacing="0">
  <thead>
    <tr>
      <th>Technology</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Next.js</strong></td>
      <td>Frontend framework for UI &amp; API routes</td>
    </tr>
    <tr>
      <td><strong>TypeScript</strong></td>
      <td>Strongly typed JavaScript</td>
    </tr>
    <tr>
      <td><strong>Tailwind CSS</strong></td>
      <td>Rapid and responsive UI styling</td>
    </tr>
    <tr>
      <td><strong>GenKit</strong></td>
      <td>LLM orchestration and flow management</td>
    </tr>
    <tr>
      <td><strong>GeminiAPI</strong></td>
      <td>AI model API powering test analysis</td>
    </tr>
    <tr>
      <td><strong>Ollama (optional)</strong></td>
      <td>Local LLM execution</td>
    </tr>
    <tr>
      <td><strong>Google Test / Jest</strong></td>
      <td>Unit testing framework</td>
    </tr>
  </tbody>
</table>



## ⚙️ Getting Started

### 🔑 Prerequisites

Ensure you have the following installed:

* [Node.js](https://nodejs.org/) (v18+ recommended)
* [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
* [Git](https://git-scm.com/)

### 🌐 Example `.env` File

```env
# ==== AI API Keys ====
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here         # Optional, if fallback is used
OLLAMA_MODEL=codellama                          # Example local model name
```

---

### 📌 Notes:

* Use `.env.local` for sensitive keys in development.
* Never commit `.env` files with real secrets to version control.

### 📦 Installation

```bash
# Clone the repository
git https://github.com/sumanulto/Unit-Test-Generator-with-AI.git
cd Unit-Test-Generator-with-AI

# Install dependencies
npm install
# or
pnpm install
```

### 🧪 Run the App Locally

```bash
# Start the development server
npm run dev
```

## 🧠 AI-Driven Workflow

1. ✅ Upload or paste your source code.
2. 🧠 Select an AI model (e.g., Gemini, Code LLaMA).
3. ⚙️ YAML-based prompts drive the test generation.
4. 🔁 Refine or regenerate based on feedback.
5. 📊 Generate a coverage report and iterate.

## 📬 Contact

For questions, reach out to:
📧 [sumanghosh@kraftamine.com](mailto:sumanghosh@kraftamine.com)
🔗 [LinkedIn](https://linkedin.com/in/sumanng)

---

