import { Guardrail } from "./base";
import { Message } from "../types";

export class JSONFormatGuardrail extends Guardrail {
  readonly name = "JSONFormatGuardrail";
  readonly type: "input" | "output";
  readonly description = "Ensures the message is valid JSON.";

  constructor(type: "input" | "output" = "output") {
    super();
    this.type = type;
  }

  async validate(message: Message["content"]): Promise<boolean> {
    try {
      // LLMs often wrap JSON in markdown code blocks, so we strip those first
      let cleanMessage = message.trim();
      if (cleanMessage.startsWith("```json")) {
        cleanMessage = cleanMessage.replace(/^```json\n?/, "").replace(/\n?```$/, "");
      } else if (cleanMessage.startsWith("```")) {
        cleanMessage = cleanMessage.replace(/^```\n?/, "").replace(/\n?```$/, "");
      }
      
      JSON.parse(cleanMessage);
      return true; // Valid JSON
    } catch (e) {
      return false; // Invalid JSON
    }
  }
}
