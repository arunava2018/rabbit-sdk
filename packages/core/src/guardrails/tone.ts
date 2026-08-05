import { Guardrail } from "./base";
import { Message } from "../types";

const CASUAL_WORDS = [
  "dude", "bro", "whatever", "nah", "yep", "dunno", "chill"
];

export class ToneGuardrail extends Guardrail {
  readonly name = "ToneGuardrail";
  readonly type: "input" | "output";
  readonly description = "Ensures the tone is professional by rejecting casual words.";
  private readonly casualWords: string[];

  constructor(customWords?: string[], type: "input" | "output" = "output") {
    super();
    this.casualWords = customWords ?? CASUAL_WORDS;
    this.type = type;
  }

  async validate(message: Message["content"]): Promise<boolean> {
    const lowerMessage = message.toLowerCase();
    
    // Quick boundary check for casual words
    for (const word of this.casualWords) {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      if (regex.test(lowerMessage)) {
        return false;
      }
    }
    
    return true;
  }
}
