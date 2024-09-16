import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import { join } from 'pathe'
import payload, { buildConfig, type Payload } from 'payload'
import { list, sleep, uid } from 'radash'
import { afterEach, beforeEach, expect } from 'vitest'
import { semanticSearchPlugin } from '../src'
import { LanceDB } from '../src/components/lancedb'
import {
	givenACollectionConfig,
	givenAVectorDB,
	givenAnEnvironment,
} from './_setup/createConfig'

describe('Semantic Search', async () => {
	let instance: Payload
	let mongo: MongoMemoryReplSet

	const spys = {
		embeddingSpy: vi.fn(() =>
			Promise.resolve(list(0, 5, (i) => Math.random())),
		),
		upsertSpy: vi.fn(),
	}

	beforeEach(async () => {
		mongo = await MongoMemoryReplSet.create({ replSet: { dbName: uid(7) } })
	})
	afterEach(async () => {
		await mongo.stop()
	})
	it('should insert a vector on create', async () => {
		const environment = givenAnEnvironment({
			collections: [givenACollectionConfig({ slug: 'myCollection' })],
			plugins: [
				semanticSearchPlugin({
					vectorDB: givenAVectorDB({ upsert: spys.upsertSpy }),
					indexableFields: ['myCollection.description'],
					enabled: true,
					dimensions: 768,
				}),
			],
			db: mongooseAdapter({
				mongoMemoryServer: mongo,
				url: mongo.getUri(uid(7)),
			}),
		})
		instance = await payload.init({
			config: buildConfig(environment),
		})
		const item = await instance.create({
			collection: 'myCollection',
			data: { description: 'hello' },
		})
		expect(item.id).toBeTruthy()
		expect(spys.upsertSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				documentId: item.id,
				collection: 'myCollection',
				field: 'description',
			}),
		)
		// @ts-ignore
		await payload.db?.destroy()
	})
	it.skipIf(process.env.CI)('should work with LanceDB', async () => {
		const tmp = await fs.mkdtemp(join(os.tmpdir(), uid(5)))
		const lance = await LanceDB.create(tmp)
		const environment = givenAnEnvironment({
			collections: [givenACollectionConfig({ slug: 'myCollection' })],
			plugins: [
				semanticSearchPlugin({
					vectorDB: lance,
					indexableFields: ['myCollection.description'],
					enabled: true,
					dimensions: 768,
				}),
			],
			db: mongooseAdapter({
				mongoMemoryServer: mongo,
				url: mongo.getUri(uid(7)),
			}),
		})
		instance = await payload.init({
			config: buildConfig(environment),
		})
		const spy = vi.spyOn(lance, 'upsert')

		const descriptions = [
			'For a gooey rich soup, add some bourbon and lime.',
			'Lobster salad has to have a chilled, dark blood oranges component.',
			'Honey soup is just not the same without sugar and ripe fluffy pork butts.',
			'Treasure, greed, and power. All seas view dark, coal-black swabbies.',
			'Landlubbers only dream of the minty fresh fix us swashbuckers have for halitosis!',
		]
		for (const description of descriptions) {
			await instance.create({
				data: { description },
				collection: 'myCollection',
			})
		}

		await sleep(800)
		expect(spy).toHaveBeenCalled()

		const raw = lance.getTable()
		const all = await raw.toArrow()
		const allArray = all.toArray()
		expect(allArray.length).toEqual(5)

		const query = 'What Crustaceans  can be served cold with citrus?'
		const result = await raw
			.search(query)
			.select(['text', 'documentId', '_distance'])
			.limit(1)
			.toArrow()
		const data = result
			.toArray()
			.map((x) => x.toJSON())
			.pop()
		expect(data).toMatchObject(
			expect.objectContaining({
				text: 'Lobster salad has to have a chilled, dark blood oranges component.',
			}),
		)

		const query2 = 'How can pirates get minty clean breath?'
		const result2 = await raw
			.search(query2)
			.select(['text', 'documentId', '_distance'])
			.limit(1)
			.toArrow()
		const data2 = result2
			.toArray()
			.map((x) => x.toJSON())
			.pop()

		expect(data2).toMatchObject(
			expect.objectContaining({
				text: 'Landlubbers only dream of the minty fresh fix us swashbuckers have for halitosis!',
			}),
		)
	})
})
