import { HelloAgent, Task } from "./Agent";
import { Effect, Layer, pipe } from "effect";
import { Schema } from "@effect/schema";
import { AppLayer, LLMServiceLive } from "./services";

describe("Agent", () => {
  it("should ", {timeout:100000},async () => {
    const program = Effect.gen(function* () {
      const agent = new HelloAgent();
      const createTask = Effect.succeed(
        new Task(
          "Create a greeting for Alex Whiteside, a software architect who enjoys sarcasm and XKCD",
          ["Be Positive", "Be Creative"],
          Schema.Struct({greeting: Schema.String}),
        ),
      );
      const result = yield* agent.process(createTask);
      console.log(result);
    });

    const ollamaLayer = LLMServiceLive();
    const runnable = Effect.provide(program, ollamaLayer);

    await Effect.runPromiseExit(runnable).then(console.log);
  });
});
