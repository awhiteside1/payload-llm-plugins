import { generate } from "../../ChatEngine/engine";
import { Ollama } from "ollama";
import { WikiSearchTool } from "./WikiTools";

export class LlamaIndexAgent {
  constructor() {}

  async process(message: string) {
    const messages = [{ role: "user", content: message }];
    const result = await generate({
      llm: new Ollama(),
      tools: [WikiSearchTool],
      messageHistory: messages,
      model: "llama3.1",
    });

    return result;
  }
}
