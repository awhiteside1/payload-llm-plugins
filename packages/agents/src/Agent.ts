import { JSONSchema, Schema } from "@effect/schema";
import { LLMService } from "./services";
import { Effect, pipe, Either } from "effect";
import { extractJSON, getMdast, stringifyMdast } from "./md";
import { Match } from "effect";
import { get, isArray, unique } from "radash";
import { isSchema, transform } from "@effect/schema/Schema";
import { getSectionByHeading } from "./md/getSection";
import { Root } from "mdast";

export class Task {
  constructor(
    readonly instructions: string,
    readonly acceptanceCriteria: Array<string> = [],
    readonly format: Schema.Schema.AnyNoContext,
  ) {}
}

class TaskResult<T extends Schema.Schema.Any> {
  constructor(
    readonly data: Schema.Schema.Type<T>,
    readonly unstructured: string,
  ) {}
}

type SupportedFormats = string | string[] | Schema.Schema.AnyNoContext;

const formatString = Match.type<SupportedFormats>().pipe(
  Match.when(Match.string, (_) => _),
  Match.when(isArray, (_) => _.map((_) => `- ${_}`).join("\n")),
  Match.when(isSchema, (_) => JSON.stringify(JSONSchema.make(_))),
  Match.when(Match.record, (_) => JSON.stringify(_)),
  Match.exhaustive,
);

export const InjectSection = (section: string, data: SupportedFormats) => {
  const content = formatString(data);
  return [`## ${section}`, content].join("\n");
};

type Section = {
  heading: string;
  purpose: string;
  format: string;
};

const sections = {
  planning: {
    heading: "Planning",
    purpose:
      "Use this section to plan your response to the task step by step, and reflect on your approach. It will be discarded. ",
    format: "valid markdown",
  },
  data: {
    heading: "Structured Data",
    purpose: "Structured data conforming to the provided schema (JSON Schema)",
    format: "A json code block containing the valid JSON ",
  },
  unstructured: {
    heading: "Unstructured Data",
    purpose:
      "Any additional data requested by the instructions which was not part of the structured data. This should rarely be used.",
    format: "valid markdown",
  },
};

const toMarkdownTable = <T extends Record<string, any>>(data: Array<T>) => {
  const keys = unique(data.flatMap((item) => Object.keys(item)));
  const headingRow = `| ${keys.join(" | ")} |`;
  const separatorRow = `|${keys.map(() => "-----").join("|")}|`;
  const dataRows = data
    .map((item) => `| ${keys.map((key) => get(item, key, "")).join(" | ")} |`)
    .join("\n");
  return [headingRow, separatorRow, dataRows].join("\n");
};

const promptContext = [
  "Your responses will only be seen by other Agents - so be precise, follow instructions, and format your response carefully.",
  "Your response should be in markdown organized into sections by blocks which start with specific Heading Level 2 headings. For example, \n```md\n## MySection \n\n This is my section. \n```\n would be a MySection section with contents 'This is my section' ",
  "The table below lists the valid sections, what heading to use, when to use it (purpose), and how to format their contents.  ",
  toMarkdownTable(Object.values(sections)),
];

export abstract class Agent {
  abstract name: string;
  abstract description: string;

  constructor() {}

  generatePrompt(task: Task) {
    const about = InjectSection(
      "About You",
      [
        `You are a ${this.name}, responsible for ${this.description}.`,
        "You are part of a multi-agent system which helps humans solve complex problems.",
      ].join("\n"),
    );

    const context = InjectSection(
      "Response Conventions",
      promptContext.join("\n"),
    );

    const details = [
      InjectSection("Instructions", task.instructions),
      InjectSection("Acceptance Criteria", task.acceptanceCriteria),
      InjectSection("Schema (JsonSchema)", task.format),
    ];

    return [about, context, ...details].join("\n\n");
  }

  process(task: Effect.Effect<Readonly<Task>, Error, never>) {
    const generatePrompt = this.generatePrompt.bind(this);
    return Effect.gen(function* () {
      const llm = yield* LLMService;

      const taskReal = yield* task;
      console.log(taskReal);
      const prompt = generatePrompt(taskReal);
      console.log(prompt);
      const response = yield* llm.generateText(prompt, "mistral-small");
      return parseTaskResponse(taskReal, response);
    });
  }
}

export class HelloAgent extends Agent {
  name = "Hello Agent";
  description = "Welcomes people to the project";
}

const parseTaskResponse = (task: Task, response: string) => {
  const root = getMdast(response);

  const getSection = <T extends Effect.Effect<any, Error, never>>(
    heading: string,
    transform?: T,
  ) => {
    return pipe(
      Effect.try({
        try: () => getSectionByHeading(root, heading),
        catch: (err) => err,
      }),
      Effect.map(transform ?? stringifyMdast),
    );
  };

  const data = getSection(sections.data.heading, (node) =>
    Schema.decodeEither(task.format)(extractJSON(node)),
  );

  if (task.format && data && Either.isLeft(data)) throw new Error("Failed");
  const unstructured = getSection(sections.unstructured.heading);
  return new TaskResult(data, unstructured);
};
