# Agent SDK

A highly extensible, provider-agnostic framework for building powerful AI Agents in TypeScript and Node.js. 

Agent SDK gives you the tools to orchestrate Large Language Models (LLMs) with strict type safety, automatic JSON schema conversion, custom tools, conversational memory, and safety guardrails.

---

## Key Features

- **Provider Agnostic:** Swap out your AI provider (OpenAI, Groq, Gemini, etc.) with a single line of code.
- **Built-in Memory:** Native conversational history management so your agents can remember context.
- **Strict Zod Tools:** Define your tools using `zod`. The SDK automatically parses them into the correct JSON schemas for the model and rigorously validates the output.
- **Custom Guardrails:** Intercept and validate user prompts or model responses to ensure safety, block profanity, or enforce formatting.
- **Out-of-the-Box Toolkit:** Includes pre-built tools like Web Search, Calculator, and Fetch.

---

## Quick Start

### 1. Installation

Install the core package and your preferred provider:

```bash
npm install @your-username/core @your-username/provider-openai zod
```
*(Note: Replace `@your-username` with the actual npm scope you published under)*

### 2. Basic Agent Loop

Here is everything you need to start a terminal-based conversational agent with access to a weather tool:

```typescript
import { Agent, Tool } from "@your-username/core";
import { OpenAIProvider } from "@your-username/provider-openai";
import { z } from "zod";
import * as readline from "readline/promises";

// 1. Define a tool using Zod
const weatherTool: Tool = {
  name: "getWeather",
  description: "Get the current weather for a location",
  schema: z.object({ location: z.string() }),
  execute: async ({ location }) => {
    return `The weather in ${location} is sunny.`; // Replace with real API
  }
};

// 2. Initialize your Agent
const agent = new Agent({
  provider: new OpenAIProvider({ apiKey: process.env.OPENAI_API_KEY }),
  systemPrompt: "You are a helpful and concise assistant.",
  tools: [weatherTool]
});

// 3. Run the conversation loop
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
console.log("Chat started! Type 'exit' to quit.\n");

while (true) {
  const input = await rl.question("You: ");
  if (input === 'exit') break;
  
  const result = await agent.run(input);
  console.log(`Agent: ${result}\n`);
}
```

---

## Documentation

### Providers

The SDK is built around an abstract `Provider` class. You can easily switch between them:

```typescript
// OpenAI
const provider = new OpenAIProvider({ apiKey: process.env.OPENAI_API_KEY, model: "gpt-4o" });

// Groq
const provider = new GroqProvider({ apiKey: process.env.GROQ_API_KEY, model: "llama3-8b-8192" });

// Gemini
const provider = new GeminiProvider({ apiKey: process.env.GEMINI_API_KEY, model: "gemini-2.5-flash" });
```

### Built-in Tools

You don't have to build everything from scratch. The SDK comes with pre-built tools you can import and pass straight into the `AgentConfig`.

```typescript
import { CalculatorTool, FetchTool, WebSearchTool } from "@your-username/core";

const agent = new Agent({
  provider: new OpenAIProvider(),
  tools: [
    new CalculatorTool(),
    new FetchTool(),
    new WebSearchTool(process.env.TAVILY_API_KEY)
  ]
});
```

### Guardrails

Guardrails run on both the user's input prompt and the model's generated output, throwing an error if validation fails. 

You can use built-in guardrails or easily write your own by extending the `Guardrail` class:

```typescript
import { Agent, ProfanityGuardrail, Guardrail } from "@your-username/core";

// Define a custom Guardrail
class NoApologyGuardrail extends Guardrail {
  readonly name = "NoApologyGuardrail";
  readonly description = "Prevents the agent from apologizing.";

  async validate(message: string): Promise<boolean> {
    const lower = message.toLowerCase();
    return !(lower.includes("sorry") || lower.includes("apologize"));
  }
}

const agent = new Agent({
  provider: myProvider,
  guardrails: [
    new ProfanityGuardrail(), // Built-in
    new NoApologyGuardrail()  // Custom
  ]
});
```

### Memory

By default, the Agent utilizes `BufferMemory`, which saves all conversational context and tool results to an internal array. When `agent.run(prompt)` is called, the entire conversation history is seamlessly passed back to the provider so the model remembers the past.

---

## Contributing

Contributions are welcome! If you'd like to add a new `Provider` integration or `Tool` to the core library, please open an issue or submit a Pull Request.# rabbit-sdk
