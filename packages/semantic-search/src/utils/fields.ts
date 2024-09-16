import type {CollectionConfig, Config, TextareaField, TextField,} from 'payload'

export interface FieldEntry {
	collectionConfig: CollectionConfig
	fieldConfig: TextField | TextareaField
}
export const getField = (
	config: Config,
	collection: string,
	field: string,
): FieldEntry | undefined => {
	const collectionConfig = config.collections?.find(
		(c) => c.slug === collection,
	)
	if (!collectionConfig) return undefined
	const fieldConfig = collectionConfig.fields.find(
		(f) => 'name' in f && f.name === field && f.type === 'text',
	)
	if (!fieldConfig) return undefined
	return { collectionConfig, fieldConfig } as FieldEntry
}

export const parseFields = (indexableFields: Array<string>) =>
	indexableFields.map((field) => {
		const split = field.split('.')
		return { field: split[1], collection: split[0] }
	})
