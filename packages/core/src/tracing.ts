import { Message, ToolCall } from "./types";

export type TraceEventPayload =
  | { type: "RunStart"; agentName: string; prompt: string }
  | { type: "ModelCall"; model: string; promptTokens?: number; completionTokens?: number }
  | { type: "ToolCall"; toolCall: ToolCall }
  | { type: "ToolResult"; toolCallId: string; result: string }
  | { type: "Handoff"; targetAgent: string; context?: any }
  | { type: "MemoryRead"; messages: Message[] }
  | { type: "MemoryWrite"; message: Message }
  | { type: "Error"; error: string; retries?: number }
  | { type: "RunEnd"; finalOutput: string };

export type TraceEvent = TraceEventPayload & { timestamp: number };

export class Trace {
  public runId: string;
  public events: TraceEvent[] = [];
  public startTime: number;
  public endTime?: number;
  
  constructor(runId: string) {
    this.runId = runId;
    this.startTime = Date.now();
  }

  public addEvent(event: TraceEvent) {
    this.events.push(event);
  }

  public end() {
    this.endTime = Date.now();
  }
}

export class Tracer {
  private traces: Map<string, Trace> = new Map();
  private currentTraceId?: string;

  public startRun(runId: string, agentName: string, prompt: string): Trace {
    const trace = new Trace(runId);
    trace.addEvent({ type: "RunStart", timestamp: Date.now(), agentName, prompt });
    this.traces.set(runId, trace);
    this.currentTraceId = runId;
    return trace;
  }

  public addEvent(event: TraceEventPayload) {
    if (!this.currentTraceId) return;
    const trace = this.traces.get(this.currentTraceId);
    if (trace) {
      trace.addEvent({ ...event, timestamp: Date.now() } as TraceEvent);
    }
  }

  public endRun(finalOutput: string) {
    if (!this.currentTraceId) return;
    const trace = this.traces.get(this.currentTraceId);
    if (trace) {
      trace.addEvent({ type: "RunEnd", timestamp: Date.now(), finalOutput });
      trace.end();
    }
    this.currentTraceId = undefined;
  }

  public getTrace(runId: string): Trace | undefined {
    return this.traces.get(runId);
  }

  public getLastTrace(): Trace | undefined {
    const keys = Array.from(this.traces.keys());
    if (keys.length === 0) return undefined;
    return this.traces.get(keys[keys.length - 1]);
  }
}
