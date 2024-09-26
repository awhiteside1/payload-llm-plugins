# Base Reasoner Class

All reasoners inherit from a class providing basic tools and task creation instructions. 


## Tools

### Get Agents

Lists the available agents and tools they can access

### Request Information

Get information on a topic or detail. 

### Ask Expert 

Ask an expert for help.

## Conventions

### Reflection
Think out loud before responding, reflect on anything any assumptions. When you have your thoughts together, use a directive separator '---' to start your final response.   

### Context

Context is injected from parent tasks. 

## Response
Responses are in the form of markdown 

```md
---
response: rejection
---

I'm rejecting this task because 
- reason 1 
- reason 2


```





