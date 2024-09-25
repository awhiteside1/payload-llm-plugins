# Agents 

An Agent is responsible for processing Tasks, and specializes in certain kinds of tasks. 

There are different kinds of Agents:


| Kind      | Purpose                                   | Examples                               |
|-----------|-------------------------------------------|----------------------------------------|
| Execution | Perform concrete, well defined tasks.     | Web Search, Writer, Coder              |
| Reasoning | Refines complex tasks into smaller tasks. | Intent Refiner, Solution Planner       |
| Experts   | Able to resolve domain specific details.  | Marketing Expert, Data Modeling Expert |
| Directors | Orchestrate and monitor tasks and agents. | Task Assigner, Metric Monitor,         |


### Agent Declaration

```ts
abstract class Agent{
  
  name: string
  skills: Array<string>
  
  abstract process<T>(task:Task<T>): Promise<TaskResult<T>>
  
  modelSettings: ModelSettings
  
}


```

```yaml

kind: execution
name: Payload CMS Agent
skills: 
  - Access Payload CMS
  - Query / Read Documents
  - Create / Update Documents
  - Describe Collections 

prompt: |
  You are an agent who can perform tasks and answer questions using the connected content management system.  


workflows:
  - name: 'List Collections'
    prompt: |
      Demo
      fdsdsf
    
  


model:
  class: 'highest'
  settings:
    temperature: 0
    


```

