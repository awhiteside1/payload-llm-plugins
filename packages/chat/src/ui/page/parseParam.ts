import type {AdminViewProps} from 'payload'
import {first, isArray, isString} from 'radash'

export const getParamValue = (
	params: AdminViewProps['params'],
	key: string,
) => {
	if (!params) return undefined
	if (!params[key]) return undefined
	const value = params[key]
	if (isString(value)) return value
	if (isArray(value)) return first(value) ?? undefined
	return undefined
}
