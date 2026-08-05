import { Agent, OpenAIProvider, GroqProvider, GeminiProvider, MaxLengthGuardrail, Guardrail, Tool } from "@rabbit-sdk/rabbit-sdk";
import "dotenv/config";
import { z } from "zod";
import * as readline from "readline/promises";

async function main() {
  const weatherTool: Tool = {
    name: "getWeather",
    description: "Get the current weather for a location",
    schema: z.object({ location: z.string() }),
    execute: async ({ location }) => {
      return `The weather in ${location} is sunny.`;
    }
  };

  let validProvider;
  if (process.env.OPENAI_API_KEY) {
    validProvider = new OpenAIProvider({ apiKey: process.env.OPENAI_API_KEY });
  } else if (process.env.GROQ_API_KEY) {
    validProvider = new GroqProvider({ apiKey: process.env.GROQ_API_KEY });
  } else if (process.env.GEMINI_API_KEY) {
    validProvider = new GeminiProvider({ apiKey: process.env.GEMINI_API_KEY });
  } else {
    console.error("❌ Please provide an API key in your .env file (OPENAI_API_KEY, GROQ_API_KEY, or GEMINI_API_KEY)");
    process.exit(1);
  }

  // Intentionally broken primary provider to demonstrate fallbacks
  const primaryProvider = new OpenAIProvider({ apiKey: "sk-invalid-key-to-force-fallback" });

  const agent = new Agent({
    provider: primaryProvider,
    fallbackProviders: [validProvider], // Self-heals by automatically switching to this one!
    maxSteps: 3,                        // Prevents infinite loops if the LLM gets confused
    systemPrompt: "You are a helpful and concise assistant. You have access to a weather tool. Use it when the user asks about the weather.",
    tools: [weatherTool],
  });

  console.log(`\n🤖 Agent initialized with primary provider: ${primaryProvider.name} (broken)`);
  console.log(`🔄 Fallback provider configured: ${validProvider.name} (valid)`);
  console.log("Chat started! Type 'exit' to quit.\n");

  // Create an interactive terminal prompt
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Loop forever until the user types 'exit'
  while (true) {
    const input = await rl.question("You: ");
    
    if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
      break;
    }
    
    try {
      const result = await agent.run(input);
      console.log(`Agent: ${result}\n`);
    } catch (e: any) {
      console.log(`Agent Error: ${e.message}\n`);
    }
  }
  
  rl.close();
}

main().catch(console.error);
