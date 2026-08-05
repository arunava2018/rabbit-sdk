import { describe, it, expect, vi, beforeEach } from "vitest";
import { FetchTool } from "../src/tools/fetch";
import { WebSearchTool } from "../src/tools/web-search";

describe("Built-in Tools", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("FetchTool", () => {
    it("should make a successful fetch request", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve("mocked response"),
      });
      global.fetch = mockFetch;

      const tool = new FetchTool();
      const result = await tool.execute({ url: "https://example.com/api" });

      expect(result).toBe("mocked response");
      expect(mockFetch).toHaveBeenCalledWith("https://example.com/api", {
        method: undefined,
        headers: undefined,
        body: undefined,
      });
    });

    it("should handle error status code responses", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
        text: () => Promise.resolve("Not Found Error"),
      });
      global.fetch = mockFetch;

      const tool = new FetchTool();
      const result = await tool.execute({ url: "https://example.com/api" });
      expect(result).toContain("Error 404 Not Found");
    });
  });

  describe("WebSearchTool", () => {
    it("should return mock response if apiKey is not provided", async () => {
      const tool = new WebSearchTool();
      const result = await tool.execute({ query: "vitest" });
      expect(result).toContain("[Mock Search Result]");
    });

    it("should make real request if apiKey is provided", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ results: ["result1", "result2"] }),
      });
      global.fetch = mockFetch;

      const tool = new WebSearchTool("test-api-key");
      const result = await tool.execute({ query: "vitest" });

      expect(JSON.parse(result)).toEqual(["result1", "result2"]);
      expect(mockFetch).toHaveBeenCalledWith("https://api.tavily.com/search", expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ api_key: "test-api-key", query: "vitest" }),
      }));
    });
  });
});
