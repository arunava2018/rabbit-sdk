import { describe, it, expect, vi, beforeEach } from "vitest";
import { Agent } from "../src/agent";
import { Provider, ProviderRequest, ProviderResponse } from "../src/provider";
import { Guardrail } from "../src/guardrails/base";
import { Tool } from "../src/types";
import { GuardrailError, ProviderError, BudgetExceededError } from "../src/errors";
import { z } from "zod";

class MockProvider extends Provider {
  name: string;
  generateMock = vi.fn();

  constructor(name = "mock-provider", model = "mock-model") {
    super(model);
    this.name = name;
  }

  async generate(request: ProviderRequest): Promise<ProviderResponse> {
    return this.generateMock(request);
  }
}

describe("Agent", () => {
  let primaryProvider: MockProvider;
  let fallbackProvider: MockProvider;

  beforeEach(() => {
    primaryProvider = new MockProvider("primary");
    fallbackProvider = new MockProvider("fallback");
  });

  it("should successfully run simple prompt without tool calls", async () => {
    primaryProvider.generateMock.mockResolvedValue({
      message: { role: "assistant", content: "Hello from assistant" }
    });

    const agent = new Agent({ provider: primaryProvider });
    const response = await agent.run("Hello");

    expect(response).toBe("Hello from assistant");
    expect(primaryProvider.generateMock).toHaveBeenCalledTimes(1);

    // Verify messages added to memory
    const messages = await agent["memory"].getMessages();
    expect(messages).toHaveLength(2);
    expect(messages[0]).toEqual({ role: "user", content: "Hello" });
    expect(messages[1]).toEqual({ role: "assistant", content: "Hello from assistant" });
  });

  it("should run input guardrails and throw GuardrailError on rejection", async () => {
    class BlockInputGuardrail extends Guardrail {
      name = "BlockInput";
      description = "block input";
      type = "input" as const;
      async validate(message: string): Promise<boolean> {
        return !message.includes("forbidden");
      }
    }

    const agent = new Agent({
      provider: primaryProvider,
      guardrails: [new BlockInputGuardrail()]
    });

    await expect(agent.run("forbidden input")).rejects.toThrow(GuardrailError);
    expect(primaryProvider.generateMock).not.toHaveBeenCalled();
  });

  it("should run output guardrails and throw GuardrailError on rejection", async () => {
    class BlockOutputGuardrail extends Guardrail {
      name = "BlockOutput";
      description = "block output";
      type = "output" as const;
      async validate(message: string): Promise<boolean> {
        return !message.includes("bad response");
      }
    }

    primaryProvider.generateMock.mockResolvedValue({
      message: { role: "assistant", content: "this is a bad response content" }
    });

    const agent = new Agent({
      provider: primaryProvider,
      guardrails: [new BlockOutputGuardrail()]
    });

    await expect(agent.run("Hello")).rejects.toThrow(GuardrailError);
  });

  it("should use fallback provider when primary fails", async () => {
    primaryProvider.generateMock.mockRejectedValue(new Error("Primary down"));
    fallbackProvider.generateMock.mockResolvedValue({
      message: { role: "assistant", content: "Fallback response" }
    });

    const agent = new Agent({
      provider: primaryProvider,
      fallbackProviders: [fallbackProvider]
    });

    const response = await agent.run("Hello");
    expect(response).toBe("Fallback response");
    expect(primaryProvider.generateMock).toHaveBeenCalledTimes(1);
    expect(fallbackProvider.generateMock).toHaveBeenCalledTimes(1);
  });

  it("should throw ProviderError when all providers fail", async () => {
    primaryProvider.generateMock.mockRejectedValue(new Error("Primary down"));
    fallbackProvider.generateMock.mockRejectedValue(new Error("Fallback down"));

    const agent = new Agent({
      provider: primaryProvider,
      fallbackProviders: [fallbackProvider]
    });

    await expect(agent.run("Hello")).rejects.toThrow(ProviderError);
  });

  it("should handle tool execution loop correctly", async () => {
    const testTool: Tool = {
      name: "testTool",
      description: "test tool",
      schema: z.object({ value: z.string() }),
      execute: vi.fn().mockResolvedValue("tool result")
    };

    // First call asks for tool execution
    primaryProvider.generateMock.mockResolvedValueOnce({
      message: {
        role: "assistant",
        content: "",
        toolCalls: [{ id: "call-1", name: "testTool", arguments: { value: "input" } }]
      }
    });

    // Second call gives the final text output
    primaryProvider.generateMock.mockResolvedValueOnce({
      message: { role: "assistant", content: "Final answer with tool result" }
    });

    const agent = new Agent({
      provider: primaryProvider,
      tools: [testTool]
    });

    const response = await agent.run("Use the tool");
    expect(response).toBe("Final answer with tool result");
    expect(testTool.execute).toHaveBeenCalledWith({ value: "input" });
    expect(primaryProvider.generateMock).toHaveBeenCalledTimes(2);

    const messages = await agent["memory"].getMessages();
    expect(messages).toHaveLength(4); // User prompt, assistant tool call, tool response, final assistant response
    expect(messages[2]).toEqual({
      role: "tool",
      content: "tool result",
      toolCallId: "call-1",
      name: "testTool"
    });
  });

  it("should throw BudgetExceededError when step count exceeds maxSteps", async () => {
    primaryProvider.generateMock.mockResolvedValue({
      message: {
        role: "assistant",
        content: "",
        toolCalls: [{ id: "call-1", name: "anyTool", arguments: {} }]
      }
    });

    const agent = new Agent({
      provider: primaryProvider,
      maxSteps: 2
    });

    await expect(agent.run("Keep looping")).rejects.toThrow(BudgetExceededError);
  });

  it("should execute multiple tool calls in parallel", async () => {
    const executionOrder: string[] = [];
    const toolA: Tool = {
      name: "toolA",
      description: "tool A",
      schema: z.object({}),
      execute: async () => {
        executionOrder.push("start A");
        await new Promise((resolve) => setTimeout(resolve, 50));
        executionOrder.push("end A");
        return "result A";
      }
    };
    const toolB: Tool = {
      name: "toolB",
      description: "tool B",
      schema: z.object({}),
      execute: async () => {
        executionOrder.push("start B");
        await new Promise((resolve) => setTimeout(resolve, 10));
        executionOrder.push("end B");
        return "result B";
      }
    };

    primaryProvider.generateMock.mockResolvedValueOnce({
      message: {
        role: "assistant",
        content: "",
        toolCalls: [
          { id: "call-a", name: "toolA", arguments: {} },
          { id: "call-b", name: "toolB", arguments: {} }
        ]
      }
    });

    primaryProvider.generateMock.mockResolvedValueOnce({
      message: { role: "assistant", content: "Done" }
    });

    const agent = new Agent({
      provider: primaryProvider,
      tools: [toolA, toolB]
    });

    await agent.run("Run both tools");

    expect(executionOrder[0]).toBe("start A");
    expect(executionOrder[1]).toBe("start B");
    expect(executionOrder[2]).toBe("end B");
    expect(executionOrder[3]).toBe("end A");
  });

  it("should handle tool execution loop correctly during streaming", async () => {
    const testTool: Tool = {
      name: "testTool",
      description: "test tool",
      schema: z.object({ value: z.string() }),
      execute: vi.fn().mockResolvedValue("tool result")
    };

    const firstStream = {
      async *[Symbol.asyncIterator]() {
        yield {
          message: {
            role: "assistant" as const,
            content: "Thought: I need to use the tool.",
          }
        };
        yield {
          message: {
            role: "assistant" as const,
            content: "",
            toolCalls: [{ id: "call-1", name: "testTool", arguments: { value: "input" } }]
          }
        };
      }
    };

    const secondStream = {
      async *[Symbol.asyncIterator]() {
        yield {
          message: {
            role: "assistant" as const,
            content: "The final answer is here."
          }
        };
      }
    };

    primaryProvider.generateMock.mockResolvedValueOnce(firstStream);
    primaryProvider.generateMock.mockResolvedValueOnce(secondStream);

    const agent = new Agent({
      provider: primaryProvider,
      tools: [testTool],
      stream: true
    });

    const responseStream = await agent.run("Use the tool");
    
    const chunks: string[] = [];
    for await (const chunk of responseStream) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual([
      "Thought: I need to use the tool.",
      "The final answer is here."
    ]);
    expect(testTool.execute).toHaveBeenCalledWith({ value: "input" });
    expect(primaryProvider.generateMock).toHaveBeenCalledTimes(2);

    const messages = await agent["memory"].getMessages();
    expect(messages).toHaveLength(4);
  });
});
