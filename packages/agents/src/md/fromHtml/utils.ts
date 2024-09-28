import {htmlPipeline} from './pipeline'

export const parseHtml = async (html: string) => {
	const res = await htmlPipeline.process(html)
	return res.value as string
}
