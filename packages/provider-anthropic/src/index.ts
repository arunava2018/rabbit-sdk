import { Provider, ProviderRequest, ProviderResponse, Message } from "@rabbit-agent-sdk/core";
import Anthropic from "@anthropic-ai/sdk";
import { zodToJsonSchema } from "zod-to-json-schema";

export interface AnthropicProviderConfig {
  apiKey?: string;
  model?: string;
}

export class AnthropicProvider extends Provider {
  public name = "anthropic";
  private client: Anthropic;

  constructor(config: AnthropicProviderConfig = {}) {
    super(config.model || "claude-3-5-sonnet-20241022");
    this.client = new Anthropic({ apiKey: config.apiKey });
  }

  public async generate(request: ProviderRequest): Promise<ProviderResponse | AsyncIterable<ProviderResponse>> {
    const messages = request.messages.map((m) => this.mapMessage(m));

    // Convert tools if provided
    const tools: Anthropic.Tool[] | undefined = request.tools?.map((t) => {
      return {
        name: t.name,
        description: t.description,
        input_schema: zodToJsonSchema(t.schema) as Anthropic.Tool.InputSchema,
      };
    });

    if (request.stream) {
      const stream = await this.client.messages.create({
        model: request.model,
        messages: messages as Anthropic.MessageParam[],
        system: request.systemPrompt,
        tools: tools,
        max_tokens: request.maxTokens ?? 1024,
        temperature: request.temperature,
        stream: true,
      });

      async function* processStream() {
        const accumulatedToolCalls: any[] = [];
        let currentContent = "";

        for await (const chunk of stream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            currentContent += chunk.delta.text;
            yield {
              message: {
                role: "assistant" as const,
                content: chunk.delta.text,
              }
            };
          }

          if (chunk.type === "content_block_start" && chunk.content_block.type === "tool_use") {
            accumulatedToolCalls[chunk.index] = {
              id: chunk.content_block.id,
              name: chunk.content_block.name,
              arguments: ""
            };
          }

          if (chunk.type === "content_block_delta" && chunk.delta.type === "input_json_delta") {
            if (accumulatedToolCalls[chunk.index]) {
              accumulatedToolCalls[chunk.index].arguments += chunk.delta.partial_json;
            }
          }
        }

        const finalToolCalls = accumulatedToolCalls.filter(Boolean).map((tc) => ({
          id: tc.id,
          name: tc.name,
          arguments: tc.arguments ? JSON.parse(tc.arguments) : {},
        }));

        if (finalToolCalls.length > 0) {
          yield {
            message: {
              role: "assistant" as const,
              content: "",
              toolCalls: finalToolCalls,
            }
          };
        }
      }
      return processStream();
    }

    const response = await this.client.messages.create({
      model: request.model,
      messages: messages as Anthropic.MessageParam[],
      system: request.systemPrompt,
      tools: tools,
      max_tokens: request.maxTokens ?? 1024,
      temperature: request.temperature,
    });

    const responseMessage: Message = {
      role: "assistant",
      content: "",
    };

    const toolCalls: any[] = [];

    for (const block of response.content) {
      if (block.type === "text") {
        responseMessage.content += block.text;
      } else if (block.type === "tool_use") {
        toolCalls.push({
          id: block.id,
          name: block.name,
          arguments: block.input,
        });
      }
    }

    if (toolCalls.length > 0) {
      responseMessage.toolCalls = toolCalls;
    }

    return {
      message: responseMessage,
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
    };
  }

  private mapMessage(msg: Message): Anthropic.MessageParam {
    if (msg.role === "tool") {
      return {
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: msg.toolCallId || "",
            content: msg.content,
          }
        ]
      };
    }
    
    if (msg.role === "assistant" && msg.toolCalls) {
      return {
        role: "assistant",
        content: msg.toolCalls.map(tc => ({
          type: "tool_use",
          id: tc.id,
          name: tc.name,
          input: tc.arguments,
        }))
      };
    }

    return {
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    };
  }
}
