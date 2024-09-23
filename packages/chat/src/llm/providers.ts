import type {Client, OllamaClient, OpenAIClient} from './clients'
import type {EmbeddingClient, LLMClient} from './types'
import {isString, parallel} from 'radash'
import {Ollama} from 'ollama'
import type {ChatCompletionMessageParam,} from 'openai/resources/chat/completions'

const mergeMessageParts = (content: ChatCompletionMessageParam['content']) => {
	if (isString(content)) return content
	if (!content) return ''
	return content.reduce((acc, cur) => {
		if (cur.type === 'text') {
			return `${acc} ${cur}`
		}
		return acc
	}, '')
}

export const providers = {
	ollama: async (
		options: OllamaClient,
	): Promise<LLMClient & EmbeddingClient> => {
		const ollama = await import('ollama')
		const client = new Ollama({ host: options.host })

		return {
			// @ts-ignore
			async chat(messages: Array<ChatCompletionMessageParam>) {
				const response = await client.chat({
					// @ts-ignore
					messages: messages.map((m) => ({
						...m,
						content: mergeMessageParts(m.content),
					})),
					stream: true,
					model: 'mistral-small',
				})
				return { ...response.message, refusal: null, role: 'assistant' }
			},
			async embed(text: Array<string>) {
				const result = await client.embed({
					model: 'nomic-embed-text',
					input: text,
				})
				return result.embeddings
			},
		}
	},
	openai: async (
		options: OpenAIClient,
	): Promise<LLMClient & EmbeddingClient> => {
		const { OpenAI } = await import('openai')
		const client = new OpenAI(options)

		return {
			async chat(messages) {
				const response = await client.chat.completions.create({
					model: 'gpt-4o-mini',
					messages: messages,
				})
				return response.choices[0].message
			},
			async embed(text) {
				const result = await parallel(3, text, async (value) => {
					const response = await client.embeddings.create({
						model: 'text-embedding-3-small',
						input: value,
					})
					return response.data[0].embedding
				})
				return result
			},
		}
	},
} as const satisfies {
	[x in Client['provider']]: (
		options: Client & { provider: x },
	) => Promise<LLMClient & EmbeddingClient>
}
