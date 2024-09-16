import type { FieldHook, FieldHookArgs } from 'payload'
import { isObject, isString } from 'radash'
import { getSemanticSearchCustom } from '../utils/customContext'

export const afterChangeHook: FieldHook = (args) => {
	if (args.operation === 'create' || args.operation === 'update') {
		if (args.previousValue !== args.value) {
			insertEmbedding(args).catch(console.error)
		}
	} else if (args.operation === 'delete') {
		deleteEmbedding(args).catch(console.error)
	}
}

const insertEmbedding = async ({
	req,
	value,
	collection,
	field,
	originalDoc,
}: Pick<
	FieldHookArgs,
	'field' | 'collection' | 'originalDoc' | 'value' | 'req'
>) => {
	const semanticSearch = getSemanticSearchCustom(req.payload.config.custom)
	if (
		!isString(value) ||
		!isString(field.name) ||
		!isObject(collection) ||
		!isObject(originalDoc) ||
		!('id' in originalDoc)
	)
		return

	await semanticSearch.vectorDB.upsert({
		text: value,
		collection: collection.slug,
		field: field.name,
		documentId: originalDoc.id as string | number,
	})
}

const deleteEmbedding = async ({
	field,
	collection,
	req,
	data,
}: Pick<FieldHookArgs, 'field' | 'collection' | 'data' | 'req'>) => {
	const semanticSearch = getSemanticSearchCustom(req.payload)

	if (
		!isString(field.name) ||
		!isObject(collection) ||
		!isObject(data) ||
		!('id' in data)
	)
		return

	await semanticSearch.vectorDB.delete({
		collection: collection.slug,
		documentId: data.id,
		field: field.name,
	})
}
