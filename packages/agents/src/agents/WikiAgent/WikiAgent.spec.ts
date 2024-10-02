import { WikiAgent } from './WikiAgent'
import { Effect } from 'effect'
import { Task } from '../../task'
import { AppLayer } from '../../services'
describe('LLamaIndex', () => {
	it('should whatever', { timeout: 100000 }, async () => {
		const agent = new WikiAgent()
		const program = Effect.gen(function* () {
			const task = new Task(
				'Get me high level, background information about Cantaloupe. ',
			)
			return yield* agent.process(task)
		})
		const runnable = Effect.provide(program, AppLayer)
		const result = await Effect.runPromise(runnable)

		expect(result).toBeDefined()
	})
})
