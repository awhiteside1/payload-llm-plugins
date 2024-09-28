import type {Schema} from '@effect/schema'
import {InjectSection} from '../ChatEngine/utils/injectSection'
import {mergePrompts} from '../ChatEngine/utils/mergePrompt'
import {isEmpty} from "radash";
import {hasValue} from "../utils/array";

export class Task {
	constructor(
		readonly instructions: string,
		readonly acceptanceCriteria: Array<string> = [],
		readonly format?: Schema.Schema.AnyNoContext,
	) {}

	describe() {
		return InjectSection(
			{ title: 'TASK', level: 1 },
			mergePrompts(
				InjectSection('Instructions', this.instructions),
				hasValue(this.acceptanceCriteria) && InjectSection('Acceptance Criteria', this.acceptanceCriteria),
				this.format && InjectSection('Schema (JsonSchema)', this.format),
			),
		)
	}
}

export class TaskResult<T extends Schema.Schema.Any | undefined = undefined> {
	unstructured = ''
	structured?: Schema.Schema.Type<T>
	constructor(readonly schema?: T) {}

	setStructured(value: Schema.Schema.Type<T>) {
		this.structured = value
	}
	setUnstructured(value: string) {
		this.unstructured = value
	}
}
