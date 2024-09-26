import { HelloAgent, Task } from "./Agent";
import { Effect } from "effect";
import { Schema } from "@effect/schema";
import { AppLayer } from "./services";

describe("Agent", () => {
  it("should ", { timeout: 100000 }, async () => {
    const program = Effect.gen(function* (_) {
      const agent = new HelloAgent();
      const createTask = Effect.succeed(
        new Task(
          "Create a greeting for Alex Whiteside, a software architect who enjoys sarcasm and XKCD",
          ["Be Positive", "Be Creative"],
          Schema.Struct({ greeting: Schema.String }),
        ),
      );
      return yield* agent.process(createTask);
    });

    // const ollamaLayer = LLMServiceLive();
    const runnable = Effect.provide(program, AppLayer);

    const output = await Effect.runPromise(runnable);
    expect(output.data).toMatchObject(
      expect.objectContaining({ greeting: expect.stringContaining("Alex") }),
    );
  });
});
