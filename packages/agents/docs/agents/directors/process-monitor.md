# Process Monitor

The process monitor tracks metrics relating to Agents, Tasks, and timing. 

## Monitoring

Task Objects fire events on creation, assignment, and completion. Appends to a DuckDB table. 

## Rabbit Holes

If a task produces many subtasks, or is cycling, this agent will force the task to return or terminate it.

## User Activity

If a task is expected to require multiple subtasks or is complex, the process monitor will issue new tasks to update the 'thinking' text to reflect what activity is occurring based on task assignment events. 