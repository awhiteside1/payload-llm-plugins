import type {TaggedUnion} from 'type-fest'
import type {ClientOptions} from 'openai'

export type OllamaClient = {
	host: string

}

export type OpenAIClient = Pick<ClientOptions, 'baseURL' | 'apiKey' | 'project'>

export type Client = TaggedUnion<
	'provider',
	{ openai: OpenAIClient; ollama: OllamaClient }
>
