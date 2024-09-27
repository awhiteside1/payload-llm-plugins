import { JSONSchema, Schema } from "@effect/schema";
import { generate } from "../ChatEngine/engine";
import { createTool } from "../ChatEngine/tools";
import { Ollama } from "ollama";

const schema = Schema.Struct({
  query: Schema.String.annotations({ description: "The query to search for" }),
});

const searchWikipedia = async (args: Schema.Schema.Type<typeof schema>) => {
  const result = await fetch(
    `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${args.query.toLowerCase()}`,
    {
      headers: {
        "api-user-agent": "Alex Whiteside (https://github.com/awhiteside1)",
        accept: "application/json",
      },
    },
  );
  return result.json();
};

const params = JSONSchema.make(schema);

const WikiSearchTool = createTool({
  name: "search_wikipedia",
  description: "query wikipedia for a given search term or topic",
  implementation: searchWikipedia,
  params: schema,
});

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
