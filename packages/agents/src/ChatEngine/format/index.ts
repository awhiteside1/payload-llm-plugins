import {type Task, TaskResult} from '../../task'
import type {GenerationResult} from '../generate/types'
import {Effect, Either} from 'effect'
import {LLMService} from '../../services'
import {mergePrompts} from '../utils/mergePrompt'
import {sectionKeys, systemPrompt} from './format'
import {InjectSection} from '../utils/injectSection'
import {extractJSON, getMdast, stringifyMdast} from '../../md'
import {Schema} from '@effect/schema'
import {getSectionByHeading} from '../../md/getSection'

interface FormatOptions {
	task: Task
	result: GenerationResult
}

const buildPrompt = ({ task, result }: FormatOptions) =>
	mergePrompts(
		systemPrompt,
		'---',
		task.describe(),
		'---',
		InjectSection('RESPONSE', result.output),
	)

export const Formatter = (options: FormatOptions) => {
	return Effect.gen(function* () {
		const result = new TaskResult(options.task.format)

		if (!options.task.format) {
			result.setUnstructured(options.result.output)
			return result
		}

		const llm = yield* LLMService
		const formatted = yield* llm.generateText(buildPrompt(options))
		const mdast = getMdast(formatted)
		if (options.task.format) {
			const data = Schema.decodeEither(options.task.format)(
				extractJSON(getSectionByHeading(mdast, sectionKeys.structuredData)),
			)
			data.pipe(
				Either.match({
					onRight: (right) => result.setStructured(right),
					onLeft: (left) => left,
				}),
			)
		}
		try {
			const unstructured = getSectionByHeading(
				mdast,
				sectionKeys.unstructuredData,
			)
			result.setUnstructured(stringifyMdast(unstructured))
		} catch (err) {}
		return result
	})
}
