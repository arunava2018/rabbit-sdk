import { z } from "zod";
import { Tool } from "./types";

export interface HandoffResult {
  type: "handoff";
  targetAgent: string;
  context?: any;
}

export class HandoffError extends Error {
  public result: HandoffResult;
  constructor(result: HandoffResult) {
    super(`Handoff to ${result.targetAgent}`);
    this.name = "HandoffError";
    this.result = result;
  }
}

/**
 * Creates a tool that an agent can call to handoff execution to another agent.
 * 
 * @param targetAgent The name of the target agent
 * @param description Description of when the agent should use this handoff tool
 */
export function createHandoffTool(targetAgent: string, description: string): Tool {
  return {
    name: `handoff_to_${targetAgent.replace(/\s+/g, "_").toLowerCase()}`,
    description,
    schema: z.object({
      context: z.any().optional().describe("Context or instructions to pass to the target agent."),
    }),
    execute: (args: any) => {
      // Throwing an error is a clean way to break out of the execution loop
      throw new HandoffError({
        type: "handoff",
        targetAgent,
        context: args.context,
      });
    },
  };
}
