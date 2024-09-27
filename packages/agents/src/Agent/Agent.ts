import { Schema } from "@effect/schema";
import { LLMService } from "../services";
import { Effect } from "effect";
import { extractJSON, getMdast } from "../md";
import { getSectionByHeading } from "../md/getSection";
import { isRight } from "effect/Either";
import { Task, TaskResult } from "../task";
import { Prompts } from "./prompts";
import { InjectSection } from "./injectSection";
import { AIFunctionLike, AIFunctionSet } from "@agentic/core";

export abstract class Agent {
  abstract name: string;
  abstract description: string;
  public tools:AIFunctionLike[] = []
  constructor() {}

  generatePrompt(task: Task) {
    const about = InjectSection(
      "About You",
      [
        `You are a ${this.name}, responsible for ${this.description}.`,
        "You are part of a multi-agent system which helps humans solve complex problems.",
      ].join("\n"),
    );

    const details = [
      about,
      Prompts.responseConventions,
      InjectSection("Instructions", task.instructions),
      InjectSection("Acceptance Criteria", task.acceptanceCriteria),
      InjectSection("Schema (JsonSchema)", task.format),
    ];

    return details.join("\n\n");
  }

  process(task: Effect.Effect<Readonly<Task>, Error, never>) {
    const generatePrompt = this.generatePrompt.bind(this);
    return Effect.gen(function* () {
      const llm = yield* LLMService;

      const taskReal = yield* task;
      const prompt = generatePrompt(taskReal);
      const response = yield* llm.generateText(prompt, "mistral-small");

      const mdast = yield* getMdast(response);
      const data = Schema.decodeEither(taskReal.format)(
        extractJSON(getSectionByHeading(mdast, Prompts.sectionKeys.data)),
      );
      if (isRight(data)) {
        return new TaskResult(data.right, "");
      }
      return new TaskResult(null, "null");
    });
  }
}
