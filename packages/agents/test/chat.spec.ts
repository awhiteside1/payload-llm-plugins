// chat.spec.ts

import { describe, it, expect } from "vitest";
import { Effect, Layer } from "effect";
import { AppLayer, DatabaseService, LLMService } from "../src/services";

describe("Chat Use Case", () => {
  it(
    "should process the user's request and generate article topics",
    { timeout: 1000000 },
    async () => {
      const agent = (prompt: string) =>
        Effect.gen(function* () {
          const llmService = yield* LLMService;
          const model = "mistral-small";
          return yield* llmService.generateText(prompt, model);
        });

      const timedEffect = agent("What is the meaning of life?").pipe(
        Effect.map((res) => {
          console.log(res);
        }),
        Effect.timeout("113 seconds"),
      );

      const runnable = Effect.provide(timedEffect, AppLayer);
      await Effect.runPromiseExit(runnable).then(console.log);
    },
  );
});
