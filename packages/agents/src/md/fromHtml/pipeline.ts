import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'
import {unified} from 'unified'
import remarkGfm from "remark-gfm";
import {moveLeadingTablesToEnd, removeHTMLStuff} from "./plugins";
import {truncate} from 'hast-util-truncate'
import {Node} from 'unist'
import remarkUnlink from 'remark-unlink'


export const htmlPipeline = unified()
	.use(rehypeParse)
	.use(removeHTMLStuff)
	.use(rehypeRemark)
	.use(remarkGfm, {tablePipeAlign:false})
	.use(remarkUnlink)
	.use(moveLeadingTablesToEnd)
	.use(remarkStringify)