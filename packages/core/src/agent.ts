import { Provider, ProviderResponse } from "./provider";
import { Memory, BufferMemory } from "./memory";
import { Tool, Message, ToolCall, Guardrails } from "./types";
import { GuardrailError, BudgetExceededError, ProviderError } from "./errors";
import { Tracer } from "./tracing";
import { HandoffError, HandoffResult } from "./handoff";

export interface AgentConfig {
  name?: string;
  provider: Provider;
  memory?: Memory;
  tools?: Tool[];
  guardrails?: Guardrails[];
  systemPrompt?: string;
  stream?: boolean;
  maxSteps?: number;
  fallbackProviders?: Provider[];
  tracer?: Tracer;
}

export class Agent {
  public name: string;
  private provider: Provider;
  private memory: Memory;
  private tools: Map<string, Tool>;
  private guardrails: Guardrails[];
  private systemPrompt?: string;
  private stream?: boolean;
  private maxSteps: number;
  private fallbackProviders: Provider[];
  private tracer?: Tracer;

  constructor(config: AgentConfig) {
    this.name = config.name ?? "Agent";
    this.provider = config.provider;
    this.memory = config.memory ?? new BufferMemory();
    this.guardrails = config.guardrails ?? [];
    this.systemPrompt = config.systemPrompt;
    this.stream = config.stream ?? false;
    this.maxSteps = config.maxSteps ?? 5;
    this.fallbackProviders = config.fallbackProviders ?? [];
    this.tracer = config.tracer;
    
    this.tools = new Map();
    if (config.tools) {
      for (const tool of config.tools) {
        this.tools.set(tool.name, tool);
      }
    }
  }

  /**
   * Execute a single prompt string against the agent.
   */
  public async run(prompt: string): Promise<any | HandoffResult> {
    const runId = Math.random().toString(36).substring(7);
    this.tracer?.startRun(runId, this.name, prompt);

    try {
      // 1. Run guardrails on user input
      for (const guardrail of this.guardrails) {
        if(guardrail.type !== "input") continue; // Skip output guardrails for input validation
        const isValid = await guardrail.validate(prompt);
        if (!isValid) {
          throw new GuardrailError(guardrail.name, `Guardrail Validation Error: Input rejected by '${guardrail.name}' guardrail.`);
        }
      }

      // 2. Add user message to memory
      const userMessage: Message = { role: "user", content: prompt };
      await this.memory.addMessage(userMessage);
      this.tracer?.addEvent({ type: "MemoryWrite", message: userMessage });

      // 3. Start the execution loop (handle tool calls)
      const result = await this.executionLoop();
      if (typeof result === "string") {
        this.tracer?.endRun(result);
      } else if (result && result.type === "handoff") {
        this.tracer?.addEvent({ type: "Handoff", targetAgent: result.targetAgent, context: result.context });
        this.tracer?.endRun(`Handoff to ${result.targetAgent}`);
      }
      return result;
    } catch (error: any) {
      this.tracer?.addEvent({ type: "Error", error: error.message });
      throw error;
    }
  }
  /**
   * Main loop that runs the provider and automatically handles tool calls
   */
  private async executionLoop(): Promise<any> {
    if (this.stream) {
      const self = this;
      async function* streamGenerator() {
        let stepCount = 0;
        const providers = [self.provider, ...self.fallbackProviders];

        while (true) {
          if (stepCount >= self.maxSteps) {
            throw new BudgetExceededError(`Run budget exceeded: The agent reached the maximum allowed steps (${self.maxSteps}).`);
          }
          stepCount++;

          const messages = await self.memory.getMessages();
          
          let response: ProviderResponse | AsyncIterable<ProviderResponse> | undefined = undefined;
          let lastError: any = undefined;

          // Call Provider with Fallbacks
          for (const p of providers) {
            try {
              if (providers.length > 1) {
                console.log(`[Agent Logs] 📡 Calling provider: '${p.name}'...`);
              }
              const requestTime = Date.now();
              response = await p.generate({
                messages,
                model: p.model,
                tools: Array.from(self.tools.values()),
                systemPrompt: self.systemPrompt,
                stream: self.stream,
              });
              self.tracer?.addEvent({ type: "ModelCall", model: p.model });
              break; // Success! Break the fallback loop
            } catch (error: any) {
              console.warn(`[Agent Logs] ⚠️ Provider '${p.name}' failed:`, error.message);
              lastError = error;
              continue; // Try the next fallback provider
            }
          }

          if (!response) {
            throw new ProviderError(`All providers in the fallback chain failed. Last error: ${lastError?.message}`);
          }

          if (!(Symbol.asyncIterator in response)) {
            throw new ProviderError(`Provider response was not an async iterable, but stream mode was enabled.`);
          }

          const stream = response as AsyncIterable<ProviderResponse>;
          let fullContent = "";
          let finalToolCalls: ToolCall[] | undefined = undefined;

          for await (const chunk of stream) {
            if (chunk.message.content) {
              fullContent += chunk.message.content;
              yield chunk.message.content;
            }
            if (chunk.message.toolCalls && chunk.message.toolCalls.length > 0) {
              finalToolCalls = chunk.message.toolCalls;
            }
          }

          // Run output guardrails on content if any
          if (fullContent) {
            for (const guardrail of self.guardrails) {
              if (guardrail.type !== "output") continue;
              const isValid = await guardrail.validate(fullContent);
              if (!isValid) {
                throw new GuardrailError(guardrail.name, `Guardrail Validation Error: Streamed output rejected by '${guardrail.name}' guardrail.`);
              }
            }
          }

          // Save assistant response to memory
          const assistantMessage: Message = { role: "assistant", content: fullContent };
          if (finalToolCalls && finalToolCalls.length > 0) {
            assistantMessage.toolCalls = finalToolCalls;
          }
          await self.memory.addMessage(assistantMessage);
          self.tracer?.addEvent({ type: "MemoryWrite", message: assistantMessage });

          // If tools were called, execute in parallel and loop back
          if (finalToolCalls && finalToolCalls.length > 0) {
            try {
              await self.handleToolCalls(finalToolCalls);
            } catch (e: any) {
              if (e instanceof HandoffError) {
                return e.result;
              }
              throw e;
            }
            continue;
          }

          // No tool calls, we are finished!
          break;
        }
      }
      return streamGenerator();
    }

    // Non-streaming execution loop
    let stepCount = 0;
    const providers = [this.provider, ...this.fallbackProviders];

    while (true) {
      if (stepCount >= this.maxSteps) {
        throw new BudgetExceededError(`Run budget exceeded: The agent reached the maximum allowed steps (${this.maxSteps}).`);
      }
      stepCount++;

      const messages = await this.memory.getMessages();
      this.tracer?.addEvent({ type: "MemoryRead", messages });
      
      let response: ProviderResponse | AsyncIterable<ProviderResponse> | undefined = undefined;
      let lastError: any = undefined;

      // Call Provider with Fallbacks
      for (const p of providers) {
        try {
          if (providers.length > 1) {
            console.log(`[Agent Logs] 📡 Calling provider: '${p.name}'...`);
          }
          response = await p.generate({
            messages,
            model: p.model,
            tools: Array.from(this.tools.values()),
            systemPrompt: this.systemPrompt,
            stream: this.stream,
          });
          const resp = response as ProviderResponse;
          this.tracer?.addEvent({ type: "ModelCall", model: p.model, promptTokens: resp.usage?.promptTokens, completionTokens: resp.usage?.completionTokens });
          break; // Success! Break the fallback loop
        } catch (error: any) {
          console.warn(`[Agent Logs] ⚠️ Provider '${p.name}' failed:`, error.message);
          lastError = error;
          continue; // Try the next fallback provider
        }
      }

      if (!response) {
        throw new ProviderError(`All providers in the fallback chain failed. Last error: ${lastError?.message}`);
      }

      const responseMessage = (response as ProviderResponse).message;
      
      // Run guardrails on model output
      if (responseMessage.content) {
        for (const guardrail of this.guardrails) {
          if (guardrail.type !== "output") continue; // SKIP INPUT GUARDRAILS
          
          const isValid = await guardrail.validate(responseMessage.content);
          if (!isValid) {
            throw new GuardrailError(guardrail.name, `Guardrail Validation Error: Model output rejected by '${guardrail.name}' guardrail.`);
          }
        }
      }

      // Save response to memory
      await this.memory.addMessage(responseMessage);
      this.tracer?.addEvent({ type: "MemoryWrite", message: responseMessage });

      // Check if tools were called
      if (responseMessage.toolCalls && responseMessage.toolCalls.length > 0) {
        try {
          await this.handleToolCalls(responseMessage.toolCalls);
        } catch (e: any) {
          if (e instanceof HandoffError) {
            return e.result;
          }
          throw e;
        }
        // Loop back to send tool results to the model
        continue;
      }

      // Return final text response
      return responseMessage.content;
    }
  }

  private async handleToolCalls(toolCalls: ToolCall[]): Promise<void> {
    const toolPromises = toolCalls.map(async (toolCall) => {
      this.tracer?.addEvent({ type: "ToolCall", toolCall });
      console.log(`\n[Agent Logs] 🛠️  Model requested tool: '${toolCall.name}' with args:`, toolCall.arguments);
      const tool = this.tools.get(toolCall.name);
      
      if (!tool) {
        console.error(`[Agent Logs] ❌  Error: Tool '${toolCall.name}' not found.`);
        return {
          role: "tool" as const,
          content: `Error: Tool '${toolCall.name}' not found.`,
          toolCallId: toolCall.id,
          name: toolCall.name,
        };
      }

      try {
        // Zod parsing (validation)
        const parsedArgs = tool.schema.parse(toolCall.arguments);
        console.log(`[Agent Logs] ⚡ Executing '${tool.name}'...`);
        
        // Execution
        const result = await tool.execute(parsedArgs);
        console.log(`[Agent Logs] ✅ Tool returned:`, result);
        const resultString = typeof result === "string" ? result : JSON.stringify(result);
        
        this.tracer?.addEvent({ type: "ToolResult", toolCallId: toolCall.id, result: resultString });

        return {
          role: "tool" as const,
          content: resultString,
          toolCallId: toolCall.id,
          name: toolCall.name,
        };
      } catch (error: any) {
        if (error instanceof HandoffError) {
          throw error; // Bubble up to outer handleToolCalls
        }
        console.error(`[Agent Logs] ❌ Tool execution failed:`, error.message);
        return {
          role: "tool" as const,
          content: `Error executing tool: ${error.message}`,
          toolCallId: toolCall.id,
          name: toolCall.name,
        };
      }
    });

    const results = await Promise.all(toolPromises);

    for (const resultMessage of results) {
      await this.memory.addMessage(resultMessage);
      this.tracer?.addEvent({ type: "MemoryWrite", message: resultMessage });
    }
  }

  public getLastTrace() {
    return this.tracer?.getLastTrace();
  }
}
