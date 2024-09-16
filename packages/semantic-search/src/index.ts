import type {Config, FieldBase} from 'payload'
import type {SemanticSearchPluginConfig} from './types'
import defu from 'defu'
import {getField, parseFields} from './utils/fields'
import {afterChangeHook} from './hooks/afterChangeHook'
import {setupSemanticSearchCustom} from './utils/customContext'

export const semanticSearchPlugin =
	(incomingPluginConfig: SemanticSearchPluginConfig) =>
	(config: Config): Config => {
		if (!incomingPluginConfig.enabled) {
			return config
		}

		setupFields(config, incomingPluginConfig.indexableFields)

		return setupSemanticSearchCustom(config, {
			vectorDB: incomingPluginConfig.vectorDB,
			embeddingFn: incomingPluginConfig.embeddingFn,
		})
	}

const setupFields = (config: Config, indexableFields: Array<string>) => {
	const fields = parseFields(indexableFields)
	for (const entry of fields) {
		const field = getField(config, entry.collection, entry.field)
		if (!field) continue
		Object.assign(field.fieldConfig, defu(field.fieldConfig, {
			hooks: { afterChange: [afterChangeHook] } satisfies FieldBase['hooks'],
		}))
		console.log(field.fieldConfig)
	}
}


export type {SemanticSearchPluginConfig, VectorDB}from './types'