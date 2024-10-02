// services.ts
import {Context, Effect, Layer} from 'effect'
import {type ChatRequest, type ChatResponse, Ollama} from 'ollama'
import type {SetOptional} from 'type-fest'
import {consola} from 'consola/basic'
import type {ConsolaInstance} from 'consola/core'

/**
 * LLMService tag
 */
export class LLMService extends Context.Tag('LLMService')<
	LLMService,
	{
		readonly preferredModel: string
		readonly ollama: Ollama
		readonly chat: (
			req: ChatRequest,
		) => Effect.Effect<ChatResponse, Error, never>
		readonly generateText: (
			prompt: string,
			model?: string,
		) => Effect.Effect<string, Error, never>
		readonly getEmbedding: (
			text: string,
		) => Effect.Effect<number[], Error, never>
	}
>() {}

export class ConsolaService extends Context.Tag('Logger')<
	ConsolaService,
	ConsolaInstance
>() {}
export const ConsolaBasic = Layer.succeed(
	ConsolaService,
	ConsolaService.of(consola),
)

/**
 * Layers providing service implementations.
 */
export const LLMServiceLive = () => {
	const ollama = new Ollama({ host: 'http://studio.local:11434' })
	const preferredModel = 'mistral-nemo'

	return Layer.succeed(
		LLMService,
		LLMService.of({
			ollama: ollama,
			preferredModel,
			chat: (request: SetOptional<ChatRequest, 'model'>) =>
				Effect.tryPromise({
					try: () =>
						ollama.chat({ model: preferredModel, ...request, stream: false }),
					catch: (err) => new Error('unknown'),
				}),
			generateText: (prompt: string, model = preferredModel) =>
				Effect.tryPromise({
					try: () =>
						ollama
							.generate({
								prompt,
								model,
								stream: false,
							})
							.then((x) => x.response),
					catch: () => new Error(),
				}),
			getEmbedding: (text: string) =>
				Effect.tryPromise({
					try: () =>
						ollama
							.embed({ model: 'nomic-embed-text', input: text })
							.then((res) => res.embeddings[0]),
					catch: (err) => new Error(),
				}),
		}),
	)
}

/**
 * Defines the application layer by composing service layers.
 */
export const AppLayer = Layer.mergeAll(LLMServiceLive(), ConsolaBasic)
