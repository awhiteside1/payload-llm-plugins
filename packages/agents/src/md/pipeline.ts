import { remark } from "remark";
import remarkGfm from "remark-gfm";
import { Root } from "mdast";

const markdownPipeline = remark().use(remarkGfm);

export const getMdast = (md: string) => {
  return markdownPipeline.parse(md);
};

export const stringifyMdast = (node: Root)=> markdownPipeline.stringify(node)