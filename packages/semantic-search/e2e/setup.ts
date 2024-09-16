import { postgresAdapter } from '@payloadcms/db-postgres'
import { Ollama } from 'ollama'
import type { CollectionConfig, Config } from 'payload'
import type { SemanticSearchPluginConfig, VectorDB } from '../src'
import { semanticSearchPlugin } from '../src'

export const givenAnEnvironment = (postgresUrl: string) => {
	const client = new Ollama({ host: 'http://100.67.29.127:11434' })

	const collection: CollectionConfig = {
		slug: 'myCollection',
		fields: [{ name: 'description', type: 'text' }],
	}
	const vectorDB = {} as VectorDB
	const embeddingFn: SemanticSearchPluginConfig['embeddingFn'] = (value) =>
		Promise.resolve([2])
	const config: Config = {
		secret: 'hello',
		db: postgresAdapter({
			pool: {
				connectionString: postgresUrl,
			},
		}),
		collections: [collection],
		plugins: [],
	}

	return config
}
