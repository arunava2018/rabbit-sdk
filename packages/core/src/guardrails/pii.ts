import { Guardrail } from "./base";
import { Message } from "../types";

export class PIIGuardrail extends Guardrail {
  readonly name = "PIIGuardrail";
  readonly type: "input" | "output";
  readonly description = "Prevents Personally Identifiable Information (PII) like SSNs or Credit Cards.";

  // Common basic regexes for PII detection
  private readonly regexes = [
    // SSN: XXX-XX-XXXX
    /\b\d{3}-\d{2}-\d{4}\b/,
    // Basic Credit Card: 16 digits, optional dashes or spaces
    /\b(?:\d[ -]*?){13,16}\b/
  ];

  constructor(type: "input" | "output" = "input") {
    super();
    this.type = type;
  }

  async validate(message: Message["content"]): Promise<boolean> {
    for (const regex of this.regexes) {
      if (regex.test(message)) {
        return false; // Reject if PII is found
      }
    }
    return true;
  }
}
