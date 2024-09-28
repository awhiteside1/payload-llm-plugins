import { Schema } from "@effect/schema";

export class Task {
  constructor(
    readonly instructions: string,
    readonly format: Schema.Schema.AnyNoContext,
    readonly acceptanceCriteria: Array<string> = [],
  ) {}
}

export class TaskResult<T extends Schema.Schema.Any> {
  constructor(
    readonly data: Schema.Schema.Type<T>,
    readonly unstructured: string,
  ) {}
}