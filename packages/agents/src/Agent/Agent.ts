import {Effect} from 'effect'
import type {Task} from '../task'
import {generate} from '../ChatEngine/generate'
import type {ToolObject} from '../ChatEngine/tools/tools'
import {Ollama} from 'ollama'
import {buildSystemPromptFor} from '../ChatEngine/generate/prompts'
import {Formatter} from '../ChatEngine/format'

export abstract class Agent {
	abstract name: string
	abstract description: string
	public tools: ToolObject[] = []

	generateAgentPersona() {
		return [
			`You are a ${this.name}, responsible for ${this.description}.`,
			'You are part of a multi-agent system which helps humans solve complex problems.',
		].join('\n')
	}

	process(task: Task) {
		return Effect.gen(this, function* () {
			const llm = new Ollama({ host: 'http://studio.local:11434' })
			const response = yield* Effect.promise(() =>
				generate({
					llm,
					tools: this.tools,
					model: 'mistral-small',
					message: task.describe(),
					systemMessage: buildSystemPromptFor(this),
				}),
			)

			const taskResult = yield* Formatter({ task, result: response })
			console.log(taskResult)
			return taskResult
		})
	}
}
