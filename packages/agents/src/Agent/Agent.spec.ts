import {HelloAgent} from '../agents/HelloAgent'
import {Effect} from 'effect'
import {Schema} from '@effect/schema'
import {AppLayer} from '../services'
import {Task} from '../task'

describe('Agent', () => {
	it('should ', { timeout: 100000 }, async () => {
		const program = Effect.gen(function* () {
			const agent = new HelloAgent()
			const result = yield* agent.process(
				new Task(
					'Create a greeting for Alex Whiteside, a software architect who enjoys sarcasm and XKCD',
					['Be Positive', 'Be Creative'],
					Schema.Struct({ greeting: Schema.String }),
				),
			)
			return result
		})

		const runnable = Effect.provide(program, AppLayer)

		const output = await Effect.runPromise(runnable)
		expect(output.structured).toMatchObject(
			expect.objectContaining({ greeting: expect.stringContaining('Alex') }),
		)
	})
})
