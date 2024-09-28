import {describe} from 'vitest'
import {mergePrompts} from './mergePrompt'

describe('Utils', () => {
	describe('Merge', () => {
			it('should return an empty string when no prompts are provided', () => {
				expect(mergePrompts()).toBe('')
			})

			it('should return the string itself when a single string is provided', () => {
				expect(mergePrompts('Hello')).toBe('Hello')
			})

			it('should filter out undefined values', () => {
				expect(mergePrompts('Hello', undefined, 'World')).toBe('Hello\nWorld')
			})

			it('should handle an array of strings', () => {
				expect(mergePrompts(['Hello', 'World'])).toBe('Hello\nWorld')
			})

			it('should handle arrays nested within an array', () => {
				expect(mergePrompts(['Hello', ['World', 'Foo'], 'Bar'])).toBe(
					'Hello\n\nWorld\nFoo\n\nBar',
				)
			})

			it('should add new lines for prompts starting with #', () => {
				expect(mergePrompts('Hello', '# This is a title', 'World')).toBe(
					'Hello\n\n# This is a title\n\nWorld',
				)
			})

			it('should correctly format multiple prompts with titles', () => {
				expect(mergePrompts('Hello', '# Chapter 1', '# Introduction')).toBe(
					'Hello\n\n# Chapter 1\n\n# Introduction',
				)
			})

			it('should not modify strings that do not start with # at the beginning', () => {
				expect(mergePrompts('Start', 'Some content', '# Title', 'End')).toBe(
					'Start\nSome content\n\n# Title\n\nEnd',
				)
			})

			it('should correctly handle mixed types of prompts', () => {
				expect(
					mergePrompts('Hello', ['World', 'Foo'], undefined, '# Title'),
				).toBe('Hello\n\nWorld\nFoo\n\n# Title')
			})

			it('should handle consecutive undefined values gracefully', () => {
				expect(mergePrompts(undefined, undefined, 'Hello')).toBe('Hello')
			})
		})
})
