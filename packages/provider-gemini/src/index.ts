import { Provider, ProviderRequest, ProviderResponse, Message } from "@rabbit-sdk/core";
import { GoogleGenAI } from "@google/genai";
import { zodToJsonSchema } from "zod-to-json-schema";

export interface GeminiProviderConfig {
  apiKey?: string;
  model?: string;
}

export class GeminiProvider extends Provider {
  public name = "gemini";
  private client: GoogleGenAI;

  constructor(config: GeminiProviderConfig = {}) {
    super(config.model || "gemini-2.5-flash");
    this.client = new GoogleGenAI({ apiKey: config.apiKey });
  }

  public async generate(request: ProviderRequest): Promise<ProviderResponse | AsyncIterable<ProviderResponse>> {
    const contents = request.messages.map((m) => this.mapMessage(m));
    
    // Convert tools
    let tools: any = undefined;
    if (request.tools && request.tools.length > 0) {
      tools = [{
        functionDeclarations: request.tools.map(t => ({
          name: t.name,
          description: t.description,
          parameters: zodToJsonSchema(t.schema) as any
        }))
      }];
    }

    if (request.stream) {
      const responseStream = await this.client.models.generateContentStream({
        model: request.model,
        contents,
        config: {
          systemInstruction: request.systemPrompt,
          temperature: request.temperature,
          tools: tools,
        }
      });

      async function* processStream() {
        for await (const chunk of responseStream) {
          const responseMessage: Message = {
            role: "assistant",
            content: chunk.text || "",
          };

          if (chunk.functionCalls && chunk.functionCalls.length > 0) {
            responseMessage.toolCalls = chunk.functionCalls.map(fc => ({
              id: Math.random().toString(36).substring(7),
              name: fc.name || "",
              arguments: fc.args || {},
            }));
          }
          yield { message: responseMessage };
        }
      }
      return processStream();
    }

    const response = await this.client.models.generateContent({
      model: request.model,
      contents,
      config: {
        systemInstruction: request.systemPrompt,
        temperature: request.temperature,
        tools: tools,
      }
    });

    const responseMessage: Message = {
      role: "assistant",
      content: response.text || "",
    };

    if (response.functionCalls && response.functionCalls.length > 0) {
      responseMessage.toolCalls = response.functionCalls.map(fc => ({
        id: Math.random().toString(36).substring(7), // Gemini SDK doesn't always provide IDs out of the box in the same way
        name: fc.name || "",
        arguments: fc.args || {},
      }));
    }

    return {
      message: responseMessage,
    };
  }



  private mapMessage(msg: Message) {
    if (msg.role === "tool") {
      return {
        role: "user",
        parts: [{
          functionResponse: {
            name: msg.name || "unknown",
            response: { result: msg.content }
          }
        }]
      };
    }
    if (msg.role === "assistant" && msg.toolCalls) {
        return {
            role: "model",
            parts: msg.toolCalls.map(tc => ({
                functionCall: {
                    name: tc.name,
                    args: tc.arguments
                }
            }))
        }
    }
    return {
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    };
  }
}
