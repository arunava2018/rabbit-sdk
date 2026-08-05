import { z } from "zod";
import { Tool } from "../types";

const FetchSchema = z.object({
  url: z.string().url().describe("The URL to fetch data from."),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]).optional().describe("The HTTP method to use (defaults to GET)."),
  headers: z.record(z.string()).optional().describe("Optional HTTP headers as a key-value object."),
  body: z.string().optional().describe("Optional request body as a string. For JSON, pass a stringified JSON object."),
});

type FetchInput = z.infer<typeof FetchSchema>;

export class FetchTool implements Tool<FetchInput, string> {
  readonly name = "FetchTool";
  readonly description = "Makes HTTP requests to REST APIs and returns the text/JSON response.";
  readonly schema = FetchSchema;

  async execute(input: FetchInput): Promise<string> {
    try {
      const response = await fetch(input.url, {
        method: input.method,
        headers: input.headers,
        body: input.body,
      });

      const text = await response.text();
      
      if (!response.ok) {
        return `Error ${response.status} ${response.statusText}: ${text}`;
      }
      
      return text;
    } catch (error: any) {
      throw new Error(`Fetch request failed: ${error.message}`);
    }
  }
}
