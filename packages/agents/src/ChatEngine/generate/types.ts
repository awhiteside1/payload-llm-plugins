import type {Message, Ollama} from 'ollama'
import type {ToolObject} from '../tools/tools'

export type GenerationResult = {
	output: string
	conversation: Array<Message>
}

export interface GenerateOptions {
	llm: Ollama
	model: string
	tools: Array<ToolObject>
	message: string
	systemMessage: string
}
