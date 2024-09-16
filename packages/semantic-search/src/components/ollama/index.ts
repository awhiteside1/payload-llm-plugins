import { TextEmbeddingFunction, getRegistry } from '@lancedb/lancedb/embedding'
import type { Float } from 'apache-arrow'
import { Ollama } from 'ollama'

interface Options {
	model: string
	timeout: number
	host: string
}

export class OllamaEmbeddings extends TextEmbeddingFunction<Partial<Options>> {
	private client: Ollama
	constructor(private modelOptions: Options) {
		super()
		this.client = new Ollama({
			host: modelOptions.host,
		})
	}
	embeddingDataType(): Float {
		return super.embeddingDataType()
	}

	override ndims() {
		return 768
	}
	toJSON(): object {
		return {
			...this.modelOptions,
			type: 'ollama',
		}
	}

	async generateEmbeddings(
		texts: string[],
	): Promise<number[][] | Float32Array[] | Float64Array[]> {
		const embeddings = await Promise.all(
			texts.map(async (text) => {
				const response = await this.client.embeddings({
					model: this.modelOptions?.model ?? 'nomic-embed-text',
					prompt: text,
				})
				return response.embedding
			}),
		)
		return embeddings
	}
}

export const register = () => {
	const registry = getRegistry()
	// @ts-ignore
	registry.register('ollama')(OllamaEmbeddings)
}
