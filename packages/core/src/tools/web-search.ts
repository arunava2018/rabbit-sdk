import { z } from "zod";
import { Tool } from "../types";

const WebSearchSchema = z.object({
  query: z.string().describe("The search query to look up on the internet."),
});

type WebSearchInput = z.infer<typeof WebSearchSchema>;

export class WebSearchTool implements Tool<WebSearchInput, string> {
  readonly name = "WebSearchTool";
  readonly description = "Searches the web for up-to-date information on a given topic.";
  readonly schema = WebSearchSchema;
  
  // An API key is typically required for a real search API
  private readonly apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async execute(input: WebSearchInput): Promise<string> {
    if (!this.apiKey) {
      return `[Mock Search Result]: Information about '${input.query}'. To use real search, provide an API key to WebSearchTool.`;
    }

    try {
      // Example using Tavily API (a popular AI search API)
      const response = await fetch(`https://api.tavily.com/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           api_key: this.apiKey,
           query: input.query
        })
      });
      
      if (!response.ok) {
         throw new Error(`Status ${response.status}`);
      }

      const data = await response.json();
      return JSON.stringify(data.results || data);
    } catch (error: any) {
      throw new Error(`Web search failed: ${error.message}`);
    }
  }
}
