import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'
import {unified} from 'unified'
import rehypeSanitize from 'rehype-sanitize'


export const htmlPipeline = unified()
	.use(rehypeParse)
	.use(rehypeRemark)
	.use(rehypeSanitize)
	.use(remarkStringify)
