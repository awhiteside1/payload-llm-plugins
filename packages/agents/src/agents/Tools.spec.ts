import { WikiAgent } from "./WikiAgent";
import { Effect } from "effect";
import { Task } from "../task";
import { Schema } from "@effect/schema";
import { AppLayer } from "../services";

describe("Wiki", () => {
  it("should ", { timeout: 1000000 }, async () => {
    const wikiAgent = new WikiAgent();
    const runnable = Effect.gen(function* () {
      return yield* wikiAgent.process(
        Effect.succeed(new Task("", [""], Schema.String)),
      );
    });
    const app = Effect.provide(runnable, AppLayer);
    await Effect.runPromiseExit(app).then(console.log);
  });
});
