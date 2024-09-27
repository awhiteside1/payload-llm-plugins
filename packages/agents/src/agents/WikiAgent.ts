import { Agent } from "../Agent/Agent";
import { Effect } from "effect";
import { Task, TaskResult } from "../task";

import { wikipedia, WikipediaClient } from "@agentic/wikipedia";
import { AIFunctionSet, createAIChain, Msg } from "@agentic/core";
import { LLMService } from "../services";
import { Message } from "ollama";
import defu from "defu";

export class WikiAgent extends Agent {
  name = "Wikipedia Agent";
  description = "Searches wikipedia for background on a given topic or term.";

  constructor() {
    super();
    const wikipedia = new WikipediaClient({
      apiUserAgent:
        "Alex Whiteside (https://github.com/awhiteside1)",
    });
    this.tools = [wikipedia];
  }

  process(task: Effect.Effect<Readonly<Task>, Error, never>) {
    return Effect.gen(this, function* () {
      const llm = yield* LLMService;

      const messages: Array<Message> = [
        {
          role: "system",
          content:
            "You are a wikipedia search assistant, who helps research requested topics.",
        },
        { role: "user", content: "What is a cantaloupe?" },
      ];
      const chain = createAIChain({
        params: { model: "mistral-small" },
        chatFn: async (args) => {
          const response = await Effect.runPromise(
            llm.chat({ ...args, model: "llama3.1" }),
          );
          response.message.tool_calls?.forEach((tool) => {
            // @ts-ignore
            tool.function.arguments = JSON.stringify(tool.function.arguments);
          });
          return response;
        },
        tools: this.tools,
      });
      const result = yield* Effect.tryPromise({
        try: () => chain({ messages, model: "llama3.1" }),
        catch: (err) => new Error(err),
      });
      console.log(result);
      return new TaskResult(null, "");
    });
  }
}
