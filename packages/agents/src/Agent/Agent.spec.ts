import { HelloAgent } from "../agents/HelloAgent";
import { Effect } from "effect";
import { Schema } from "@effect/schema";
import { AppLayer } from "../services";
import { Task } from "../task";

describe("Agent", () => {
  it("should ", { timeout: 100000 }, async () => {
    const agent = new HelloAgent();
    const program = Effect.gen(function* () {


      return yield* agent.process(new Task(
          "Create a greeting for Alex Whiteside, a software architect who enjoys sarcasm and XKCD",
          Schema.Struct({ greeting: Schema.String }), ["Be Positive", "Be Creative"]
      ),);
    });

    const runnable = Effect.provide(program, AppLayer);

    const output = await Effect.runPromise(runnable);
    expect(output.data).toMatchObject(
      expect.objectContaining({ greeting: expect.stringContaining("Alex") }),
    );
  });
});
