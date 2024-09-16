type EmbeddingFunction = (text: string) => Promise<number[]>

type VectorStoreTable = {
	/**
	 * Vector representation
	 */
	vector: number[]
	/**
	 * The collection this embedding is from
	 */
	collection: string
	/**
	 * The index this embedding is from
	 */
	field: string
	/**
	 * The document this refers to
	 */
	documentId: string | number
	/**
	 * When this entry was created
	 */
	modified: Date
}

type InsertFields = Omit<VectorStoreTable, 'modified'>
type Identifier = Pick<VectorStoreTable, 'collection' | 'documentId' | 'field'>
type Index = Pick<VectorStoreTable, 'collection' | 'field'>
type Result = Omit<VectorStoreTable, 'vector'> & { distance: number }

export type VectorDB = {
	name: string
	createTable: (dimensions: number) => Promise<void>
	upsert: (fields: InsertFields) => Promise<void>
	delete: (record: Identifier) => Promise<void>
	search: (index: Index, queryVector: number[]) => Result
}

export type SemanticSearchPluginConfig = {
	embeddingFn: EmbeddingFunction
	enabled: boolean
	dimensions: number
	/**
	 * Dot notation of which fields should be indexed
	 */
	indexableFields: string[]
	vectorDB: VectorDB
}
