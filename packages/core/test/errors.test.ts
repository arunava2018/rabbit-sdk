import { describe, it, expect } from "vitest";
import {
  AgentError,
  GuardrailError,
  ToolExecutionError,
  ProviderError,
  BudgetExceededError
} from "../src/errors";

describe("Custom Errors", () => {
  it("should instantiate AgentError with standard inheritance properties", () => {
    const error = new AgentError("something failed");
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AgentError);
    expect(error.name).toBe("AgentError");
    expect(error.message).toBe("something failed");
  });

  it("should instantiate GuardrailError with guardrailName property", () => {
    const error = new GuardrailError("TestGuardrail", "rejected");
    expect(error).toBeInstanceOf(AgentError);
    expect(error.guardrailName).toBe("TestGuardrail");
    expect(error.message).toBe("rejected");
  });

  it("should instantiate ToolExecutionError with toolName property", () => {
    const error = new ToolExecutionError("TestTool", "tool failed");
    expect(error).toBeInstanceOf(AgentError);
    expect(error.toolName).toBe("TestTool");
    expect(error.message).toBe("tool failed");
  });

  it("should instantiate ProviderError", () => {
    const error = new ProviderError("provider down");
    expect(error).toBeInstanceOf(AgentError);
    expect(error.message).toBe("provider down");
  });

  it("should instantiate BudgetExceededError", () => {
    const error = new BudgetExceededError("too many steps");
    expect(error).toBeInstanceOf(AgentError);
    expect(error.message).toBe("too many steps");
  });
});
