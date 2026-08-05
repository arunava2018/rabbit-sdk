export class AgentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype); // Restores prototype chain correctly in TypeScript
  }
}

export class GuardrailError extends AgentError {
  constructor(public guardrailName: string, message: string) {
    super(message);
  }
}

export class ToolExecutionError extends AgentError {
  constructor(public toolName: string, message: string) {
    super(message);
  }
}

export class ProviderError extends AgentError {
  constructor(message: string) {
    super(message);
  }
}

export class BudgetExceededError extends AgentError {
  constructor(message: string) {
    super(message);
  }
}
