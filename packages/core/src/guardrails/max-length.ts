import { Guardrail } from "./base";
import { Message } from "../types";

export class MaxLengthGuardrail extends Guardrail {
  readonly name = "MaxLengthGuardrail";
  readonly type: "input" | "output";
  readonly description = "Ensures the message content does not exceed the maximum allowed length.";
  
  constructor(private readonly maxLength: number, type: "input" | "output") {
    super();
    this.type = type;
  }

  async validate(message: Message["content"]): Promise<boolean> {
    return message.length <= this.maxLength;
  }
}
