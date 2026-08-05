import { describe, it, expect } from "vitest";
import { BufferMemory } from "../src/memory";

describe("BufferMemory", () => {
  it("should initialize with an empty message list", () => {
    const memory = new BufferMemory();
    expect(memory.getMessages()).toEqual([]);
  });

  it("should add a single message", () => {
    const memory = new BufferMemory();
    const msg = { role: "user" as const, content: "Hello" };
    memory.addMessage(msg);
    expect(memory.getMessages()).toEqual([msg]);
  });

  it("should add multiple messages", () => {
    const memory = new BufferMemory();
    const msgs = [
      { role: "user" as const, content: "Hello" },
      { role: "assistant" as const, content: "Hi" }
    ];
    memory.addMessages(msgs);
    expect(memory.getMessages()).toEqual(msgs);
  });

  it("should clear messages", () => {
    const memory = new BufferMemory();
    memory.addMessage({ role: "user" as const, content: "Hello" });
    memory.clear();
    expect(memory.getMessages()).toEqual([]);
  });
});
