import type { Code, Root } from "mdast";
import { select } from "unist-util-select";

export const extractJSON = (tree: Root) => {
  const result = select("code[lang=json]", tree) as Code;
  const object = JSON.parse(result.value);
  return object;
};


