import { Message } from "./types";

export abstract class Memory {
  public abstract addMessage(message: Message): Promise<void> | void;
  public abstract addMessages(messages: Message[]): Promise<void> | void;
  public abstract getMessages(): Promise<Message[]> | Message[];
  public abstract clear(): Promise<void> | void;
}

export class BufferMemory extends Memory {
  private messages: Message[] = [];

  public addMessage(message: Message): void {
    this.messages.push(message);
  }
  
  public addMessages(messages: Message[]): void {
    this.messages.push(...messages);
  }

  public getMessages(): Message[] {
    return [...this.messages];
  }

  public clear(): void {
    this.messages = [];
  }
}
