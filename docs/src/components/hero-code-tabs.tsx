"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const snippets = {
  Agent: `import { Agent, OpenAIProvider } from "@rabbit-agent-sdk/rabbit-agent-sdk";

const agent = new Agent({
  provider: new OpenAIProvider({ apiKey: process.env.OPENAI_API_KEY }),
  systemPrompt: "You are a helpful assistant.",
});

const response = await agent.run("Hello, who are you?");
console.log(response);`,
  Tools: `import { Agent, OpenAIProvider, Tool } from "@rabbit-agent-sdk/rabbit-agent-sdk";
import { z } from "zod";

const weatherTool: Tool = {
  name: "getWeather",
  description: "Get the current weather for a location",
  schema: z.object({ location: z.string() }),
  execute: async ({ location }) => \`The weather in \${location} is sunny.\`,
};

const agent = new Agent({
  provider: new OpenAIProvider(),
  tools: [weatherTool],
});

await agent.run("What's the weather in Tokyo?");`,
  Guardrails: `import { Agent, OpenAIProvider, PIIGuardrail, ToneGuardrail } from "@rabbit-agent-sdk/rabbit-agent-sdk";

const agent = new Agent({
  provider: new OpenAIProvider(),
  guardrails: [
    new PIIGuardrail(), // Blocks SSN/credit cards in input
    new ToneGuardrail(), // Enforces professional tone in output
  ],
});

// Throws GuardrailError if PII is detected
await agent.run("My SSN is 123-45-6789");`,
  Streaming: `import { Agent, OpenAIProvider } from "@rabbit-agent-sdk/rabbit-agent-sdk";

const agent = new Agent({
  provider: new OpenAIProvider(),
  stream: true, // Enable async generator
});

const stream = await agent.run("Write a poem about TypeScript.");

for await (const chunk of stream) {
  process.stdout.write(chunk);
}`,
  Fallbacks: `import { Agent, OpenAIProvider, GroqProvider } from "@rabbit-agent-sdk/rabbit-agent-sdk";

const agent = new Agent({
  // Primary provider
  provider: new OpenAIProvider({ apiKey: "invalid-key" }),
  // Seamless fallbacks
  fallbackProviders: [
    new GroqProvider({ apiKey: process.env.GROQ_API_KEY }),
  ],
});

// Self-heals and uses Groq automatically
await agent.run("Hello!");`,
}

type TabKey = keyof typeof snippets

type Token = { text: string; class: string }
function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = []
  let rest = line

  const patterns: [RegExp, string][] = [
    [/^(import|export|from|const|new|await|async|return|=>)(?=\s|{)/, "text-[#f47067]"],
    [/^(Agent|OpenAIProvider|GroqProvider|Tool|z|PIIGuardrail|ToneGuardrail)(?=\s*[({.,])/, "text-[#dcbdfb]"],
    [/^(getWeather|execute|location|response|agent|provider|systemPrompt|tools|name|description|schema|apiKey|fallbackProviders|guardrails|stream)(?=\s*[(:,])/, "text-[#6cb6ff]"],
    [/^(process\.env\.[A-Z_]+)/, "text-[#6cb6ff]"],
    [/^(`[^`]*`|"[^"]*"|'[^']*')/, "text-[#96d0ff]"],
    [/^(\/\/.*)/, "text-[#636e7b]"],
    [/^(z\.(object|string)\(\))/, "text-[#dcbdfb]"],
    [/^[{}[\](),;.:?]/, "text-[#adbac7]"],
    [/^\s+/, ""],
    [/^[^\s{}[\](),;.:?"'`]+/, "text-[#adbac7]"],
  ]

  while (rest.length > 0) {
    let matched = false
    for (const [regex, cls] of patterns) {
      const m = rest.match(regex)
      if (m) {
        tokens.push({ text: m[0], class: cls })
        rest = rest.slice(m[0].length)
        matched = true
        break
      }
    }
    if (!matched) {
      tokens.push({ text: rest[0], class: "text-[#adbac7]" })
      rest = rest.slice(1)
    }
  }
  return tokens
}

export function HeroCodeTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>("Tools")
  
  const lines = snippets[activeTab].split("\n")

  return (
    <div className="relative">
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-blue-600/20 via-purple-600/10 to-emerald-600/20 blur-sm" />
      <div className="relative rounded-xl border border-[#2a2a2a] overflow-hidden shadow-2xl bg-[#0d1117] flex flex-col">
        {/* Tabs Bar */}
        <div className="flex items-center overflow-x-auto bg-[#010409] border-b border-[#2a2a2a] scrollbar-hide">
          {(Object.keys(snippets) as TabKey[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2.5 text-xs font-semibold tracking-wide whitespace-nowrap transition-colors border-r border-[#2a2a2a]",
                activeTab === tab
                  ? "bg-[#0d1117] text-[#e6edf3] border-t-2 border-t-[#3b82f6]"
                  : "bg-transparent text-[#7d8590] hover:bg-[#161b22] hover:text-[#c9d1d9] border-t-2 border-t-transparent"
              )}
            >
              {tab}
            </button>
          ))}
          <div className="flex-1 bg-[#010409]" />
        </div>

        {/* Code Content */}
        <div className="overflow-x-auto p-4 min-h-[320px]">
          <table className="w-full border-collapse text-[13px] font-mono leading-relaxed">
            <tbody>
              {lines.map((line, i) => (
                <tr key={i} className="hover:bg-[#161b22]/60 transition-colors group">
                  <td className="select-none text-right pr-4 text-[#484f58] group-hover:text-[#6e7681] text-xs w-8 align-top">
                    {i + 1}
                  </td>
                  <td className="pr-6 whitespace-pre align-top">
                    {line === "" ? (
                      <span>&nbsp;</span>
                    ) : (
                      tokenizeLine(line).map((tok, j) => (
                        <span key={j} className={tok.class}>{tok.text}</span>
                      ))
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Bar (like the GPT-4o toggle in screenshot) */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#2a2a2a] bg-[#010409]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
            </div>
            <span className="text-[10px] font-medium text-[#7d8590] uppercase tracking-wider">
              {activeTab === "Fallbacks" ? "Multi-Model" : "OpenAI GPT-4o"}
            </span>
          </div>
          <span className="text-[10px] font-medium text-[#484f58] uppercase tracking-wider">
            agent.ts
          </span>
        </div>
      </div>
    </div>
  )
}
