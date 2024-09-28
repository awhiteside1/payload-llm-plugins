import {Schema} from "@effect/schema";
import {Effect} from "effect";
import {extractJSON, getMdast} from "../md";
import {getSectionByHeading} from "../md/getSection";
import {isRight} from "effect/Either";
import {type Task, TaskResult} from "../task";
import {Prompts} from "./prompts";
import {InjectSection} from "./injectSection";
import {generate} from "../ChatEngine/engine";
import type {ToolObject} from "../ChatEngine/tools";
import {Ollama} from "ollama";

export abstract class Agent {
	abstract name: string
	abstract description: string
	public tools: ToolObject[] = []

	generatePrompt(task: Task) {
		const about = InjectSection(
			'About You',
			[
				`You are a ${this.name}, responsible for ${this.description}.`,
				'You are part of a multi-agent system which helps humans solve complex problems.',
			].join('\n'),
		)

		const details = [
			about,
			Prompts.responseConventions,
			InjectSection('Instructions', task.instructions),
			InjectSection('Acceptance Criteria', task.acceptanceCriteria),
			InjectSection('Schema (JsonSchema)', task.format),
		]

		return details.join('\n\n')
	}

	process(task: Task) {
		return Effect.gen(this, function* () {
			const llm = new Ollama({host:'http://studio.local:11434'})
			const prompt = this.generatePrompt(task)
			const messages = [{ role: 'user', content: prompt }]
			const response = yield* Effect.promise(()=>generate({
				llm,
				tools: this.tools,
				model: 'mistral-small',
				messageHistory: messages,
			}))

			const lastMessage = response[-1]

			const mdast = getMdast(lastMessage.content)
			const data = Schema.decodeEither(task.format)(
				extractJSON(getSectionByHeading(mdast, Prompts.sectionKeys.data)),
			)
			if (isRight(data)) {
				return new TaskResult(data.right, '')
			}
			return new TaskResult(null, 'null')
		})
	}
}
