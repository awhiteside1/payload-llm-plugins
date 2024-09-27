import { toMarkdownTable } from "../md/utils";
import { InjectSection } from "./injectSection";
import { mapValues } from "radash";

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
} satisfies Record<string, Section>;

export const promptContext = [
  "Your responses will only be seen by other Agents - so be precise, follow instructions, and format your response carefully.",
  "Your response should be in markdown organized into sections by blocks which start with specific Heading Level 2 headings. For example, \n```md\n## MySection \n\n This is my section. \n```\n would be a MySection section with contents 'This is my section' ",
  "The table below lists the valid sections, what heading to use, when to use it (purpose), and how to format their contents.  ",
  toMarkdownTable(Object.values(sections)),
];

const tooluse = [
  "You may be provided tools which you may choose to invoke to complete this task.",
  "If you choose to invoke a tool, it will be executed and the result appended as a message in the chat history.",
  "While using appropriate tools and information from their responses to complete the task is encouraged, do not reference your use of the tool in your final response.",
].join("\n");

export const Prompts = {
  sectionKeys: mapValues(sections, (section) => section.heading),
  responseConventions: InjectSection(
    "Response Conventions",
    promptContext.join("\n"),
  ),
  toolUse: InjectSection(
    "Tools",
    tooluse
  ),
};
