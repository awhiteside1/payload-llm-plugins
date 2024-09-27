import { HelloAgent } from "../agents/HelloAgent";
import { Effect } from "effect";
import { Schema } from "@effect/schema";
import { AppLayer } from "../services";
import { Task } from "../task";

describe("Agent", () => {
  it("should ", { timeout: 100000 }, async () => {
    const agent = new HelloAgent();
    const program = Effect.gen(function* () {

      const createTask = Effect.succeed(
        new Task(
          "Create a greeting for Alex Whiteside, a software architect who enjoys sarcasm and XKCD",
          ["Be Positive", "Be Creative"],
          Schema.Struct({ greeting: Schema.String }),
        ),
      );
      return yield* agent.process(createTask);
    });

    const runnable = Effect.provide(program, AppLayer);

    const output = await Effect.runPromise(runnable);
    expect(output.data).toMatchObject(
      expect.objectContaining({ greeting: expect.stringContaining("Alex") }),
    );
  });
});
