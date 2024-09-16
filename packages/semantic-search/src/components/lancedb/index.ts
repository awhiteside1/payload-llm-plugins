import { type Table, connect } from '@lancedb/lancedb'
import { LanceSchema, getRegistry } from '@lancedb/lancedb/embedding'
import { Utf8 } from 'apache-arrow'
import type { Identifier, InsertFields, VectorDB } from '../../types'
import { OllamaEmbeddings, register } from '../ollama'

register()

export class LanceDB implements VectorDB {
	public name = 'lancedb'
	async search(index: { collection: string; field: string }, query: string) {
		const where = `WHERE field=${index.field} and collection=${index.collection} `
		const result = await this.table
			.search(query)
			.where(where)
			.limit(5)
			.toArray()
		return result.map((res) => res.toJSON())
	}

	constructor(private table: Table) {}

	getTable() {
		return this.table
	}

	static async create(path = './lancedb') {
		const func = new OllamaEmbeddings({
			host: 'http://100.67.29.127:11434',
			model: 'nomic-embed-text',
			timeout: 10000,
		})
		const schema = LanceSchema({
			text: func.sourceField(),
			documentId: new Utf8(),
			field: new Utf8(),
			collection: new Utf8(),
			vector: func.vectorField(),
		})

		const connection = await connect(path)
		const table = await connection.createEmptyTable(
			'payloadDocuments',
			schema,
			{ existOk: true },
		)
		const instance = new LanceDB(table)
		return instance
	}

	async delete(record: Identifier) {
		const where = `WHERE documentId=${record.documentId} and field=${record.field} and collection=${record.collection}`
		await this.table.delete(where)
	}

	async upsert(fields: InsertFields) {
		await this.table.add([fields])
	}
}
