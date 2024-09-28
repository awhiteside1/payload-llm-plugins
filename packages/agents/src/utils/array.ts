import {get, isArray, isObject, isPrimitive} from 'radash'

export type NonEmptyArray<T> = [T, ...T[]]

export const assertNonEmptyArray = <T>(array: Array<T>) => {
	const validArray = isArray(array)
	const firstElementIsValid = !!get(array, '[0]')

	if (validArray && firstElementIsValid) {
		return array as NonEmptyArray<T>
	}
	throw new Error('Array is Empty')
}

export const hasValue = (subject: unknown): boolean => {
	if (isPrimitive(subject)) {
		return !!subject
	}
	if (isArray(subject)) {
		return subject.some(hasValue)
	}
	if (isObject(subject)) {
		return Object.values(subject).some(hasValue)
	}
	return true
}
