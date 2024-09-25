// types.ts

import { Effect } from "effect"

/**
 * Represents the shared context among agents.
 */
export interface AgentContext {
  [key: string]: any
}

/**
 * Represents a tool that an agent can use.
 */
export type Tool = {
  name: string
  action: (args: any) => Effect.Effect<any, Error, any>
}

/**
 * Represents a directive that guides agent behavior.
 */
export type Directive = {
  description: string
  condition: (context: AgentContext) => boolean
}

/**
 * Base interface for all agents.
 */
export interface Agent {
  name: string
  preferredModel: string
  prompts: string[]
  tools: Tool[]
  directives: Directive[]
  execute: (context: AgentContext) => Effect.Effect<any, Error, AgentContext>
}

/**
 * Represents an article in the CMS.
 */
export type Article = {
  id: string
  title: string
  content: string
}

/**
 * Represents a log event.
 */
export type LogEvent = {
  timestamp: Date
  agentName: string
  message: string
}

/**
 * Represents the status of a process.
 */
export type ProcessStatus = {
  id: string
  status: string
  details?: string
}

/**
 * Represents a task in the system.
 */
export interface Task {
  id: string
  status: "pending" | "in-progress" | "completed" | "paused"
  assignee?: Agent
  context: AgentContext
  parentTaskId?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Manages tasks within the system.
 */
export class TaskManager {
  private tasks: Map<string, Task> = new Map()

  /**
   * Creates a new task.
   * @param context The context for the task.
   * @param parentTaskId Optional parent task ID.
   * @returns The created task.
   */
  createTask(context: AgentContext, parentTaskId?: string): Task {
    const task: Task = {
      id: this.generateTaskId(),
      status: "pending",
      context,
      parentTaskId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.tasks.set(task.id, task)
    return task
  }

  /**
   * Updates a task.
   * @param task The task to update.
   */
  updateTask(task: Task): void {
    task.updatedAt = new Date()
    this.tasks.set(task.id, task)
  }

  /**
   * Retrieves the next unassigned task.
   * @returns The next task or undefined.
   */
  getNextTask(): Task | undefined {
    for (const task of this.tasks.values()) {
      if (task.status === "pending" && !task.assignee) {
        return task
      }
    }
    return undefined
  }

  /**
   * Generates a unique task ID.
   * @returns A unique string.
   */
  private generateTaskId(): string {
    return Math.random().toString(36).substring(2)
  }
}