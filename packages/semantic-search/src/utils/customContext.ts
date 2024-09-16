import type { Config } from 'payload'
import { isObject } from 'radash'
import type { SemanticSearchPluginConfig, VectorDB } from '../types'

export type SemanticSearchCustomObject = {
	vectorDB: VectorDB
	embeddingFn: SemanticSearchPluginConfig['embeddingFn']
}

export const CUSTOMKEY = 'semantic-search'

export const getSemanticSearchCustom = (custom: unknown) => {
	if (isObject(custom) && CUSTOMKEY in custom) {
		return custom[CUSTOMKEY] as SemanticSearchCustomObject
	}
	throw new Error('Not a valid object')
}

export const setupSemanticSearchCustom = (
	payloadConfig: Config,
	customContext: SemanticSearchCustomObject,
) => {
	payloadConfig.custom = {
		...payloadConfig.custom,
		[CUSTOMKEY]: customContext,
	}
	return payloadConfig
}
