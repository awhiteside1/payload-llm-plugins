import payload, { buildConfig, type Payload } from 'payload'
import { list } from 'radash'
import { afterAll, beforeAll, expect, inject } from 'vitest'
import { semanticSearchPlugin } from '../src'
import { givenAnEnvironment } from './setup'

describe('Semantic Search', () => {
	let instance: Payload

	const spys = {
		embeddingSpy: vi.fn(() =>
			Promise.resolve(list(0, 5, (i) => Math.random())),
		),
		upsertSpy: vi.fn(),
	}

	beforeAll(async () => {
		const postgres = inject('postgresURL')
		const environment = givenAnEnvironment(postgres)
		environment.plugins?.push(
			semanticSearchPlugin({
				vectorDB: {
					name: 'mock',
					upsert: spys.upsertSpy,
					search: vi.fn(),
					createTable: vi.fn(),
					delete: vi.fn(),
				},
				indexableFields: ['myCollection.description'],
				enabled: true,
				dimensions: 768,
				embeddingFn: spys.embeddingSpy,
			}),
		)
		instance = await payload.init({
			config: buildConfig(environment),
			loggerOptions: { enabled: false },
		})
	})

	afterAll(async () => {
		try {
			await instance.db.pool.end()
		} catch (err) {}
	})

	it('should work', async () => {
		const item = await instance.create({
			collection: 'myCollection',
			data: { description: 'hello' },
		})
		expect(item.id).toBeTruthy()
		expect(spys.embeddingSpy).toHaveBeenCalledWith('hello')
		expect(spys.upsertSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				documentId: 1,
				collection: 'myCollection',
				field: 'description',
			}),
		)
	})
})
