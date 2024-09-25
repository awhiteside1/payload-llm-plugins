Task Interface

```ts
import { Schema } from "@effect/schema"

interface Task{
  
  
  summary: string
  acceptanceCriteria: string[]
  format: Schema
  
  parent: Task
  
  
  
}



```


Agent Interface

```ts



interface Agent{
  
  assign(task:Task){
    
}
  
}


```



Status

```ts


interface {

}

interface AgentStatus {
  class: "execution" | "reasoner" | "director";
  available: boolean;
  invocations: number;
  failRate: number;
  p95: number;
}

interface SystemStatus {
  agents: AgentStatus[];


}

```