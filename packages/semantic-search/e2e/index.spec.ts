import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import payload, { buildConfig, type Payload } from 'payload'
import { list } from 'radash'
import { beforeAll, expect } from 'vitest'
import { semanticSearchPlugin } from '../src'
import {
	givenACollectionConfig,
	givenAVectorDB,
	givenAnEnvironment,
} from './_setup/createConfig'

describe('Semantic Search', () => {
	let instance: Payload

	const spys = {
		embeddingSpy: vi.fn(() =>
			Promise.resolve(list(0, 5, (i) => Math.random())),
		),
		upsertSpy: vi.fn(),
	}

	beforeAll(async () => {
		const mongo = await MongoMemoryReplSet.create()

		const environment = givenAnEnvironment({
			collections: [givenACollectionConfig({ slug: 'myCollection' })],
			plugins: [
				semanticSearchPlugin({
					vectorDB: givenAVectorDB({ upsert: spys.upsertSpy }),
					indexableFields: ['myCollection.description'],
					enabled: true,
					dimensions: 768,
					embeddingFn: spys.embeddingSpy,
				}),
			],
			db: mongooseAdapter({ mongoMemoryServer: mongo, url: mongo.getUri() }),
		})
		instance = await payload.init({
			config: buildConfig(environment),
			loggerOptions: { enabled: true },
		})
	})

	it('should insert a vector on create', async () => {
		const item = await instance.create({
			collection: 'myCollection',
			data: { description: 'hello' },
		})
		expect(item.id).toBeTruthy()
		expect(spys.embeddingSpy).toHaveBeenCalledWith('hello')
		expect(spys.upsertSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				documentId: item.id,
				collection: 'myCollection',
				field: 'description',
			}),
		)
	})
})
