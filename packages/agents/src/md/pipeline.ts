import { remark } from "remark";
import remarkGfm from "remark-gfm";
import { Root } from "mdast";
import { Effect } from "effect";

const markdownPipeline = remark().use(remarkGfm);

export const getMdast = (md: string) => {
  return Effect.succeed(markdownPipeline.parse(md));
};

export const stringifyMdast = (node: Root)=> Effect.succeed(markdownPipeline.stringify(node))