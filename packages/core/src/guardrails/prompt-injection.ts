import { Guardrail } from "./base";
import { Message } from "../types";

const DEFAULT_INJECTION_HEURISTICS = [
  "ignore all previous instructions",
  "ignore previous instructions",
  "disregard previous instructions",
  "system prompt",
  "forget everything",
  "you are now",
  "new instructions"
];

export class PromptInjectionGuardrail extends Guardrail {
  readonly name = "PromptInjectionGuardrail";
  readonly description = "Detects heuristics common in prompt injection attacks.";
  private readonly heuristics: string[];
  readonly type: "input" | "output";

  constructor(customHeuristics?: string[], type: "input" | "output" = "input") {
    super();
    this.heuristics = customHeuristics ?? DEFAULT_INJECTION_HEURISTICS;
    this.type = type;
  }

  async validate(message: Message["content"]): Promise<boolean> {
    const lowerMessage = message.toLowerCase();
    
    for (const heuristic of this.heuristics) {
      if (lowerMessage.includes(heuristic)) {
        return false;
      }
    }
    
    return true;
  }
}
