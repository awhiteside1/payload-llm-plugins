import { Schema } from "@effect/schema";

export class Task {
  constructor(
    readonly instructions: string,
    readonly acceptanceCriteria: Array<string> = [],
    readonly format: Schema.Schema.AnyNoContext,
  ) {}
}

export class TaskResult<T extends Schema.Schema.Any> {
  constructor(
    readonly data: Schema.Schema.Type<T>,
    readonly unstructured: string,
  ) {}
}