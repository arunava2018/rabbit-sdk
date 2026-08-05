import { Guardrails, Message } from "../types";

export abstract class Guardrail implements Guardrails {
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly type: "input" | "output";
  abstract validate(message: Message["content"]): Promise<boolean>;
}
