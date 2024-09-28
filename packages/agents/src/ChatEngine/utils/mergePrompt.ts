import {isArray, isString} from 'radash'

type PromptItem = string | Array<PromptItem> | undefined | false

const padWithNewLines = (val: string) => {
	return `\n${val}\n`
}

export const mergePrompts = (...prompts: PromptItem[]): string => {
	return prompts
		.filter(Boolean)
		.map((entry, index) => {
			if (isArray(entry)) {
				return padWithNewLines(mergePrompts(...entry))
			}
			if (isString(entry) && index > 0 && entry.startsWith('#')) {
				return padWithNewLines(entry)
			}
			return entry
		})
		.join('\n')
		.replaceAll('\n\n\n', '\n\n')
		.trim()
}
