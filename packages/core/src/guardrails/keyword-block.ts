import { Guardrail } from "./base";
import { Message } from "../types";
export class KeywordBlockGuardrail extends Guardrail {
  readonly name = "KeywordBlockGuardrail";
  readonly description = "Blocks messages containing specific keywords.";
  private readonly blockedKeywords: string[];
  readonly type: "input" | "output";
  constructor(blockedKeywords: string[], type: "input" | "output") {
    super();
    this.blockedKeywords = blockedKeywords;
    this.type = type;
  }
  async validate(message: Message["content"]): Promise<boolean> {
    for (const keyword of this.blockedKeywords) {
      if (message.includes(keyword)) {
        return false;
      }
    }
    return true;
  }
}