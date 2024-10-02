import {Effect} from 'effect'
import type {Task} from '../task'
import {generate} from '../ChatEngine/generate'
import type {ToolObject} from '../ChatEngine/tools/tools'
import {buildSystemPromptFor} from '../ChatEngine/generate/prompts'
import {Formatter} from '../ChatEngine/format'
import {ConsolaService, LLMService} from '../services'

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
			const consola = yield* ConsolaService
			consola.start(`Invoking ${this.name} Agent`)
			const llm = yield* LLMService
			const response = yield* Effect.promise(() =>
				generate({
					model: 'mistral-nemo',
					llm: llm.ollama,
					tools: this.tools,
					message: task.describe(),
					systemMessage: buildSystemPromptFor(this),
				}),
			)
			consola.success(`${this.name} Chat Generation completed`)
			console.table(JSON.stringify(response))
			consola.start(`${this.name} Formatter Running`)
			const taskResult = yield* Formatter({ task, result: response })
			consola.success(`${this.name} Formatting  completed`)

			console.log(taskResult)
			return taskResult
		})
	}
}
