import { Provider, ProviderRequest, ProviderResponse, Message } from "@agent-sdk/core";
import OpenAI from "openai";
import { zodToJsonSchema } from "zod-to-json-schema";

export interface OpenAIProviderConfig {
  apiKey?: string;
  model?: string;
}

export class OpenAIProvider extends Provider {
  public name = "openai";
  private client: OpenAI;

  constructor(config: OpenAIProviderConfig = {}) {
    super(config.model || "gpt-4o");
    this.client = new OpenAI({ apiKey: config.apiKey });
  }

  public async generate(request: ProviderRequest): Promise<ProviderResponse | AsyncIterable<ProviderResponse>> {
    const messages = request.messages.map((m) => this.mapMessage(m));
    
    if (request.systemPrompt) {
      messages.unshift({ role: "system", content: request.systemPrompt });
    }

    // Convert tools if provided
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
              id: tc.id || "",
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
      content: choice.message.content || "",
    };

    if (choice.message.tool_calls) {
      responseMessage.toolCalls = choice.message.tool_calls.map((tc) => ({
        id: tc.id,
        name: tc.function.name,
        arguments: tc.function.arguments ? JSON.parse(tc.function.arguments) : {},
      }));
    }

    return {
      message: responseMessage,
      usage: (response as any).usage ? {
        promptTokens: (response as any).usage.prompt_tokens,
        completionTokens: (response as any).usage.completion_tokens,
        totalTokens: (response as any).usage.total_tokens,
      } : undefined,
    };
  }

  private mapMessage(msg: Message) {
    if (msg.role === "tool") {
      return {
        role: "tool",
        content: msg.content,
        tool_call_id: msg.toolCallId,
      };
    }
    // Assistant message with tool calls
    if (msg.role === "assistant" && msg.toolCalls) {
      return {
        role: "assistant",
        content: msg.content,
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
