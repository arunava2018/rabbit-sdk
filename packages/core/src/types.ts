import { z } from "zod";

export type Role = "user" | "assistant" | "system" | "tool";

export interface ToolCall {
  id: string;
  name: string;
  arguments: any;
}
export interface Guardrails {
  name: string;
  description: string;
  type : "input" | "output";
  validate(message: Message["content"]): Promise<boolean>;
}
export interface Message {
  role: Role;
  content: string;
  toolCalls?: ToolCall[];
  toolCallId?: string; // Present if role is "tool"
  name?: string; // Optional name of the tool if role is "tool"
}

export interface Tool<TInput = any, TOutput = any> {
  name: string;
  description: string;
  schema: z.ZodSchema<TInput>;
  execute: (input: TInput) => Promise<TOutput> | TOutput;
}
