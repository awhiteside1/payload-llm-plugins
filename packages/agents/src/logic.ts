// logic.ts

import { Agent, AgentContext, Task, TaskManager } from "./types"
import { Effect, Context } from "effect"
import { LLMService, CMSService, DatabaseService } from "./services"

/**
 * Implements the Director agent.
 */
export class Director implements Agent {
  name = "Director"
  preferredModel = "gpt-4"
  prompts = ["Monitor and assign tasks..."]
  tools = []
  directives = []
  taskAssigner = new TaskAssigner()

  execute(context: AgentContext): Effect.Effect<AgentContext, Error, AgentContext> {
    return Effect.gen(function* (this: Director, _) {
      const currentTask: Task = context.currentTask

      if (!currentTask.assignee) {
        yield* _(Effect.suspend(() => this.taskAssigner.assignTask(currentTask)))
      }

      return context
    }.bind(this))
  }
}

/**
 * Implements the Task Assigner agent.
 */
export class TaskAssigner implements Agent {
  name = "TaskAssigner"
  preferredModel = ""
  prompts = []
  tools = []
  directives = []

  assignTask(task: Task): Effect.Effect<Task, Error, Task> {
    return Effect.succeed(() => {
      // Simple assignment logic based on task context
      if (!task.context.intent) {
        task.assignee = new IntentRefiner()
      } else if (!task.context.plan) {
        task.assignee = new SolutionPlanner()
      } else if (task.context.plan && !task.context.executed) {
        task.assignee = new ExecutorAgent()
      } else {
        task.assignee = undefined // Change null to undefined
      }
      task.status = task.assignee ? "in-progress" : "completed"
      return task
    })
  }

  execute(context: AgentContext): Effect.Effect<any, Error, AgentContext> {
    // Not used in this agent
    return Effect.succeed(context)
  }
}

/**
 * Implements the Intent Refiner agent.
 */
export class IntentRefiner implements Agent {
  name = "IntentRefiner"
  preferredModel = "gpt-4"
  prompts = ["Refine the user's intent..."]
  tools = []
  directives = []

  execute(context: AgentContext): Effect.Effect<any, Error, AgentContext> {
    return Effect.gen(function* (_) {
      // Add intent and intended artifact to the context
      context.intent = "Generate Information"
      context.intendedArtifact = "List of Titles (for Articles)"

      // Identify that SEO understanding is required
      const needsSEOBackground = true

      if (needsSEOBackground) {
        const taskManager: TaskManager = context.taskManager
        const seoTask = taskManager.createTask(
          { description: "Gather background about SEO...", taskManager },
          context.currentTask.id
        )
        context.status = "paused"
        // The Director will pick up this new task in the next iteration
      }

      return context
    })
  }
}

/**
 * Implements the Solution Planner agent.
 */
export class SolutionPlanner implements Agent {
  name = "SolutionPlanner"
  preferredModel = "gpt-4"
  prompts = ["Plan the solution steps..."]
  tools = []
  directives = []

  execute(context: AgentContext): Effect.Effect<any, Error, AgentContext> {
    return Effect.gen(function* (_) {
      // Create a plan and add it to the context
      context.plan = [
        "Determine details about existing articles",
        "Bring in SEO Expert to validate and provide guidance",
        "Plan actions based on guidance",
        "Generate article titles",
        "Present articles to user",
      ]
      return context
    })
  }
}

/**
 * Implements the Executor agent.
 */
export class ExecutorAgent implements Agent {
  name = "ExecutorAgent"
  preferredModel = "gpt-4"
  prompts = ["Execute the following task..."]
  tools = [
    {
      name: "LLMTool",
      action: (args: { prompt: string }) =>
        Effect.flatMap(Context.get(LLMService), (llmService) =>
          llmService.generateText(args.prompt, "gpt-4")
        ),
    },
    {
      name: "CMSTool",
      action: (args: { query: any }) =>
        Effect.flatMap(Context.get(CMSService), (cmsService) =>
          cmsService.fetchArticles(args.query)
        ),
    },
  ] as const

  execute(context: AgentContext): Effect.Effect<AgentContext, Error, AgentContext> {
    return Effect.gen(function* (this: ExecutorAgent, _) {
      const articles = yield* _(this.tools[1].action({ query: { limit: 20 } }))
      context.existingArticles = articles

      const generatedTitles = yield* _(
        this.tools[0].action({
          prompt: "Generate article titles similar to existing articles.",
        })
      )
      context.generatedTitles = generatedTitles

      context.executed = true

      return context
    }.bind(this))
  }
}

/**
 * Implements the Scribe agent.
 */
export class ScribeAgent implements Agent {
  name = "ScribeAgent"
  preferredModel = ""
  prompts = []
  tools = []
  directives = []

  execute(context: AgentContext): Effect.Effect<AgentContext, Error, AgentContext> {
    return Effect.flatMap(Context.get(DatabaseService), (databaseService) =>
      databaseService.logEvent({
        timestamp: new Date(),
        agentName: context.agentName,
        message: context.message,
      }).pipe(Effect.as(context))
    )
  }
}

/**
 * Implements the Process Manager agent.
 */
export class ProcessManagerAgent implements Agent {
  name = "ProcessManagerAgent"
  preferredModel = ""
  prompts = []
  tools = []
  directives = []

  execute(context: AgentContext): Effect.Effect<AgentContext, Error, AgentContext> {
    return Effect.gen(function* (_) {
      const databaseService = yield* _(Context.get(DatabaseService))
      const status = yield* _(databaseService.getProcessStatus(context.processId))
      // Update status if necessary
      yield* _(
        databaseService.updateProcessStatus(context.processId, {
          ...status,
          status: "updated",
        })
      )
      return context
    })
  }
}