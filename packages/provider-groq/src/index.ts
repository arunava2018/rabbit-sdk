import { Provider, ProviderRequest, ProviderResponse, Message } from "@agent-sdk/core";
import Groq from "groq-sdk";
import { zodToJsonSchema } from "zod-to-json-schema";

export interface GroqProviderConfig {
  apiKey?: string;
  model?: string;
}

export class GroqProvider extends Provider {
  public name = "groq";
  private client: Groq;

  constructor(config: GroqProviderConfig = {}) {
    super(config.model || "llama3-8b-8192");
    this.client = new Groq({ apiKey: config.apiKey });
  }

  public async generate(request: ProviderRequest): Promise<ProviderResponse | AsyncIterable<ProviderResponse>> {
    const messages = request.messages.map((m) => this.mapMessage(m));
    
    if (request.systemPrompt) {
      messages.unshift({ role: "system", content: request.systemPrompt });
    }

    const tools = request.tools?.map((t) => {
      return {
        type: "function" as const,
        function: {
          name: t.name,
          description: t.description,
          parameters: zodToJsonSchema(t.schema) as Record<string, any>
        },
      };
    });

    const response = await this.client.chat.completions.create({
      model: request.model,
      messages: messages as any,
      tools: tools?.length ? tools : undefined,
      temperature: request.temperature,
      max_tokens: request.maxTokens,
      stream: request.stream,
    });

    if (request.stream) {
      async function* processStream() {
        for await (const chunk of response as any) {
          const choice = chunk.choices[0];
          
          const responseMessage: Message = {
            role: "assistant",
            content: choice?.delta?.content || "",
          };

          if (choice?.delta?.tool_calls) {
            responseMessage.toolCalls = choice.delta.tool_calls.map((tc: any) => ({
              id: tc.id || Math.random().toString(36).substring(7),
              name: tc.function?.name || "",
              arguments: tc.function?.arguments ? JSON.parse(tc.function.arguments) : {},
            }));
          }

          yield { message: responseMessage };
        }
      }
      return processStream();
    }

    const choice = (response as any).choices[0];
    
    const responseMessage: Message = {
      role: "assistant",
      content: choice.message?.content || "",
    };

    if (choice.message?.tool_calls) {
      responseMessage.toolCalls = choice.message.tool_calls.map((tc) => ({
        id: tc.id || Math.random().toString(36).substring(7),
        name: tc.function?.name || "",
        arguments: tc.function?.arguments ? JSON.parse(tc.function.arguments) : {},
      }));
    }

    return {
      message: responseMessage,
      usage: (response as any).usage ? {
        promptTokens: (response as any).usage.prompt_tokens || 0,
        completionTokens: (response as any).usage.completion_tokens || 0,
        totalTokens: (response as any).usage.total_tokens || 0,
      } : undefined,
    };
  }

  private mapMessage(msg: Message) {
    if (msg.role === "tool") {
      return {
        role: "tool",
        content: msg.content,
        name: msg.name, // Groq requires 'name' for tool responses
        tool_call_id: msg.toolCallId,
      };
    }
    if (msg.role === "assistant" && msg.toolCalls) {
      return {
        role: "assistant",
        content: msg.content || "",
        tool_calls: msg.toolCalls.map(tc => ({
            id: tc.id,
            type: "function",
            function: { name: tc.name, arguments: JSON.stringify(tc.arguments) }
        }))
      }
    }
    return {
      role: msg.role,
      content: msg.content,
    };
  }
}
