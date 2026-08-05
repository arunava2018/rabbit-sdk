import { Message, Tool } from "./types";

export interface ProviderRequest {
  messages: Message[];
  tools?: Tool[];
  model: string;
  stream?: boolean;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ProviderResponse {
  message: Message;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export abstract class Provider {
  public abstract name: string;
  
  /**
   * The model to use for generation (e.g. "gpt-4o", "llama-3-8b")
   */
  public model: string;

  constructor(model: string) {
    this.model = model;
  }

  /**
   * Execute a generation request against the underlying API.
   * @param request Standardized provider request
   */
  public abstract generate(request: ProviderRequest): Promise<ProviderResponse | AsyncIterable<ProviderResponse>>;

}
