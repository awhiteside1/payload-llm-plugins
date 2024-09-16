import { mongooseAdapter } from '@payloadcms/db-mongodb'
import defu from 'defu'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import type { CollectionConfig, Config } from 'payload'
import { uid } from 'radash'
import { inject } from 'vitest'
import type { VectorDB } from '../../src'

export const givenACollectionConfig = (
	base: Partial<CollectionConfig> = {},
): CollectionConfig => {
	return defu(base, {
		slug: 'myCollection',
		fields: [{ name: 'description', type: 'text' }],
	}) as CollectionConfig
}
export const givenAnEnvironment = (base: Partial<Config>): Config => {
	const x = process.env.NODE_ENV

	const config: Config = {
		secret: 'hello',
		// db: postgresAdapter({
		// 	pool: {
		// 		connectionString: inject('postgresURL'),
		// 	},
		// }),
		db: mongooseAdapter({ url: inject('mongoURL') }),
		plugins: [],
	}

	return defu(base, config) as Config
}

export const givenAVectorDB = (base: Partial<VectorDB>) => {
	return defu(base, {
		name: 'mock',
		upsert: vi.fn(),
		search: vi.fn(),
		createTable: vi.fn(),
		delete: vi.fn(),
	}) as VectorDB
}
