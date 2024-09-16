import defu from 'defu'
import type { Config, FieldBase } from 'payload'
import { afterChangeHook } from './hooks/afterChangeHook'
import type { SemanticSearchPluginConfig } from './types'
import { setupSemanticSearchCustom } from './utils/customContext'
import { getField, parseFields } from './utils/fields'

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
		Object.assign(
			field.fieldConfig,
			defu(field.fieldConfig, {
				hooks: { afterChange: [afterChangeHook] } satisfies FieldBase['hooks'],
			}),
		)
		console.log(field.fieldConfig)
	}
}

export type { SemanticSearchPluginConfig, VectorDB } from './types'
