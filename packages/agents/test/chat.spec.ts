// chat.spec.ts

import { describe, it, expect } from "vitest"
import { Effect, Layer } from "effect"
import { TaskManager, AgentContext } from "../src/types"
import { Director, ScribeAgent } from "../src/logic"
import { AppLayer,  DatabaseService } from "../src/services"

describe("Chat Use Case", () => {
  it("should process the user's request and generate article topics", async () => {
    // User input
    const initialContext: AgentContext = {
      userMessage: "What are some possible article topics which would improve our SEO?",
      taskManager: new TaskManager(), // Temporary placeholder, will be replaced by service
    }

    // Create initial task
    const initialTask = initialContext.taskManager.createTask(initialContext)
    initialContext.currentTask = initialTask

    // Start the process
    const program: Effect.Effect<never, never, AgentContext> = Effect.gen(function* (_) {
      const taskManager = yield* _(TaskManagerService)
      const director = yield* _(DirectorService)
      const scribe = yield* _(ScribeAgentService)

      let currentTask = initialTask

      while (currentTask) {
        // Set current task in context
        currentTask.context.currentTask = currentTask

        // Director handles task assignment
        yield* _(director.execute(currentTask.context))

        // Agent executes the task
        if (currentTask.assignee) {
          currentTask.context.agentName = currentTask.assignee.name
          currentTask.context.processId = currentTask.id
          currentTask.context.message = `Task ${currentTask.id} executed by ${currentTask.assignee.name}`

          currentTask.context = yield* _(
            currentTask.assignee.execute(currentTask.context)
          )

          currentTask.status = "completed"
          taskManager.updateTask(currentTask)

          // Scribe logs the event
          yield* _(scribe.execute(currentTask.context))
        }

        // Check for new tasks or subtasks
        const nextTask = taskManager.getNextTask()
        if (nextTask === undefined) {
          break
        }
        currentTask = nextTask
      }

      return initialContext
    })

    // Run the program with the composed layers
    const finalContext = await Effect.runPromise(program.provideLayer(AppLayer))

    // Assertions
    if ('generatedTitles' in finalContext) {
      expect(finalContext.generatedTitles).toBeDefined()
      expect(finalContext.generatedTitles).toContain(
        "Generated titles based on prompt: Generate article titles similar to existing articles."
      )
      console.log("Generated Titles:", finalContext.generatedTitles)
    } else {
      throw new Error("generatedTitles not found in finalContext")
    }
  })
})