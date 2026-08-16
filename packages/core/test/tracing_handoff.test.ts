import { describe, it, expect, vi } from "vitest";
import { Agent, Tracer, createHandoffTool, HandoffResult } from "../src";
import { Provider, ProviderRequest, ProviderResponse } from "../src/provider";
import { Message } from "../src/types";

class MockProvider extends Provider {
  public name = "MockProvider";
  
  constructor(public mockGenerate: (req: ProviderRequest) => Promise<ProviderResponse>) {
    super("mock-model");
  }

  public async generate(request: ProviderRequest): Promise<ProviderResponse | AsyncIterable<ProviderResponse>> {
    return this.mockGenerate(request);
  }
}

describe("Tracing and Handoffs", () => {
  it("should record traces correctly", async () => {
    const tracer = new Tracer();
    
    const provider = new MockProvider(async (req) => {
      return {
        message: { role: "assistant", content: "Hello there!" },
        usage: { promptTokens: 10, completionTokens: 5, totalTokens: 15 }
      };
    });

    const agent = new Agent({
      name: "TestAgent",
      provider,
      tracer,
    });

    const result = await agent.run("Hello");
    expect(result).toBe("Hello there!");

    const trace = agent.getLastTrace();
    expect(trace).toBeDefined();
    expect(trace?.events.length).toBeGreaterThan(0);
    
    const eventTypes = trace?.events.map(e => e.type);
    expect(eventTypes).toContain("RunStart");
    expect(eventTypes).toContain("MemoryWrite");
    expect(eventTypes).toContain("MemoryRead");
    expect(eventTypes).toContain("ModelCall");
    expect(eventTypes).toContain("RunEnd");
  });

  it("should correctly handle handoff", async () => {
    const tracer = new Tracer();
    const handoffTool = createHandoffTool("AgentB", "Handoff to B");
    
    let callCount = 0;
    const provider = new MockProvider(async (req) => {
      callCount++;
      if (callCount === 1) {
        return {
          message: {
            role: "assistant",
            content: "",
            toolCalls: [{ id: "call_1", name: handoffTool.name, arguments: { context: "Some data" } }]
          }
        };
      }
      return { message: { role: "assistant", content: "Should not reach here" } };
    });

    const agent = new Agent({
      name: "AgentA",
      provider,
      tools: [handoffTool],
      tracer,
    });

    const result = await agent.run("Do task");
    expect(result).toBeDefined();
    expect((result as HandoffResult).type).toBe("handoff");
    expect((result as HandoffResult).targetAgent).toBe("AgentB");
    expect((result as HandoffResult).context).toBe("Some data");

    const trace = agent.getLastTrace();
    const eventTypes = trace?.events.map(e => e.type);
    expect(eventTypes).toContain("ToolCall");
    expect(eventTypes).toContain("Handoff");
  });
});
