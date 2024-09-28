import { remark } from "remark";
import remarkGfm from "remark-gfm";
import type { Root } from "mdast";


const markdownPipeline = remark().use(remarkGfm);

export const getMdast = (md: string) => markdownPipeline.parse(md)

export const stringifyMdast = (node: Root)=> markdownPipeline.stringify(node)