# Agents 

An Agent is responsible for processing Tasks, and specializes in certain kinds of tasks. 

There are different kinds of Agents:


| Kind      | Purpose                                   | Examples                               |
|-----------|-------------------------------------------|----------------------------------------|
| Execution | Perform concrete, well defined tasks.     | Web Search, Writer, Coder              |
| Reasoning | Refines complex tasks into smaller tasks. | Intent Refiner, Solution Planner       |
| Experts   | Able to resolve domain specific details.  | Marketing Expert, Data Modeling Expert |
| Directors | Orchestrate and monitor tasks and agents. | Task Assigner, Metric Monitor,         |


## Creating Agents

### Typescript classes

Agents can be created by extending the `Agent` class and implementing the necessary methods. These classes can then be registered with the runtime. 


```ts

class WikipediaAgent extends ExecutionAgent {

  name = "Wikipedia";
  description = "Searches Wikipedia for a given term";
  prompt = "You are an expert wikipedia searcher who helps.....";

  override async process(task: Task): Promise<TaskResult> {
    return super.process(task);
  }

  async search(query: string): Promise<string> {
    const url = `https://wikipedia.com/wiki/${snake(query)}`;
    const response = await fetch(url);
    if (response.ok) {
      const contents = await response.text();
      const startingPoint = contents.search("mw-content-text");
      return conents.substring(startingPoint);
    }
    throw new Error(response.statusText);
  }
  
}


```


```ts
const runtime = new AgentRuntime();
runtime.registerAgents([WikipediaAgent]);
```

### YAML Manifests 

Agents can be declared as YAML files, making them easy to create for end users or LLMs. 

```yaml
kind: Agent
name: Wikipedia
skills: 
  - Query wikipedia for background

prompt: |
  You are an expert wikipedia searcher who helps perform background research. Ground your responses based on the results of the search tool. Do not make anything up. If the search returns a disambiguation page, extract the term from the page and search again.  
  
tools:
  - name: search
    parameters: 
      - query: 
          - type: string
            description: The slug to query wikipedia for
    source:
      type: generate
      prompt: Use the `query` parameter to construct a wikipedia url in the format `https://en.wikipedia.org/wiki/{query}`. Make sure to replace the spaces with underscores so it's URL Safe. Then fetch the html of that page. Return the  contents of the div with id "mw-content-text".   
      

model:
  class: 'highest'
  settings:
    temperature: 0

```





