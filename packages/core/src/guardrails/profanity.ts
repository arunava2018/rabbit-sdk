import { Guardrail } from "./base";
import { Message } from "../types";

const DEFAULT_PROFANITY_LIST = [
  "damn", "hell", "crap", "shit", "fuck", "bitch", "ass", "bastard"
];

export class ProfanityGuardrail extends Guardrail {
  readonly name = "ProfanityGuardrail";
  readonly description = "Blocks messages containing known profanity.";
  readonly type: "input" | "output";
  private readonly wordList: string[];

  constructor(customWordList?: string[], type: "input" | "output" = "input") {
    super();
    this.wordList = customWordList ?? DEFAULT_PROFANITY_LIST;
    this.type = type;
  }

  async validate(message: Message["content"]): Promise<boolean> {
    const lowerMessage = message.toLowerCase();
    
    for (const word of this.wordList) {
      // Use regex to match whole words and ignore case
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(lowerMessage)) {
        return false;
      }
    }
    return true;
  }
}
