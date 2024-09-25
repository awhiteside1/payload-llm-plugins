[# Tasks
A task represents work to be processed, acceptance criteria, and the format desired.

```ts
interface Task {
  // Input
  instructions: string;
  notes: Array<string>;
  // Desired Output 
  format: Schema<any>;
  acceptanceCriteria: Array<string>;
}
```

A Task Service orchestrates task actions.

```ts

interface TaskService{
  submitTask(task:Task): Deferred<TaskResult>
  cancelTask(task:Task): Promise<void>
}
```

Submitted Tasks are processed by a Task Assigner who chooses an Agent for processing. 

The agent is invoked on the task and produces a Task Result or a Task Rejection.

```ts
class TaskResult<T>{
  task: Task<T>
  result: T
  notes?: Array<string>
}

class TaskRejection{
  task:Task
  reasons: Array<string>
}

interface Agent{
  processTask(task:Task): Promise<TaskResult | TaskRejection>
}

```
Rejected tasks may be reassigned to an alternate agent if makes sense.

The result is returned to the task submitter. 

Metrics are submitted to the process monitor. 



