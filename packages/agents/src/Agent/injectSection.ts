import { JSONSchema, type Schema } from "@effect/schema";
import { Match } from "effect";
import { isArray } from "radash";
import { isSchema } from "@effect/schema/Schema";

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