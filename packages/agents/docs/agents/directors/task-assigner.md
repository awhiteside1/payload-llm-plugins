# Task Assigner Agent

This agent inspects a submitted task, and selects from the list of registered agents the one most appropriate. That agent is then assigned the task. 

## Details 

### Reassignment
If the model rejects the task, times out or fails to complete the task, the Task Assigner may re-assign it to another Agent.

### Gibberish 
If the task is nonsense or malformed, the agent can create a new task to respond to the user generically and assign the task to the Communication Agent. 

