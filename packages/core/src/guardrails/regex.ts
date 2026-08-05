import { Guardrail } from "./base";
import { Message } from "../types";

export class RegexGuardrail extends Guardrail {
  readonly name = "RegexGuardrail";
  readonly type: "input" | "output";
  readonly description = "Validates the message against a regular expression.";

  constructor(
    private readonly regex: RegExp,
    private readonly blockOnMatch: boolean = true,
    type: "input" | "output" = "input"
  ) {
    super();
    this.type = type;   
  }

  async validate(message: Message["content"]): Promise<boolean> {
    const isMatch = this.regex.test(message);
    
    // If blockOnMatch is true, we want to return false (fail validation) when there is a match.
    // If blockOnMatch is false, we want to return true (pass validation) when there is a match.
    return this.blockOnMatch ? !isMatch : isMatch;
  }
}
