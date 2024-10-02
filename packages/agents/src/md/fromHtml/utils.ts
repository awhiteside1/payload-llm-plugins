import {htmlPipeline} from './pipeline'

export const parseHtml = async (html: string): Promise<string> => {
	const withoutHead = html.replace(/<head[^>]*>.*?<\/head>/s, '')

	const res = await htmlPipeline.process(withoutHead)
	return res.value as string
}
