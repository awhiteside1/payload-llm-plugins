# Lifecycle

## Initializing

Loads and allows setting of properties and generally static, safe things. No references allowed. Async is frowned upon.

### Use Cases

Read from env vars
Check for Ollama running
Compute local paths
Load Agent Definitions
Queue preparations

### Returns

#### Success

    List of Preperations

#### Failure

    Error Message

## Preparing

Preparing runs potentially long, async, cross service interactions that are required before being 'ready'.

### Use Cases

Create an empty data base
Request Ollama pulls a model

## Running

A running program responds to events published by Notify(), scheduled jobs and status requests.

```ts


interface RunningProgram {
  /**
   * Ends all running fibers and closes all connections
   */
  shutdown(): Promise<void>;

  /**
   * Returns current status of the system
   */
  status(): Promise<SystemStatus>;

  /**
   * Publishes an event to the system, which decideds how to act
   * @param event
   */
  notify(event: Event): Promise<void>;

}
```

## External Interface

```ts
// Define Static Configuration 
const config = buildConfig({
  llmProviders: { openai: {}, ollama: {} },
  filesystem: InMemoryFS
});

// Initialize the Runtime
const runtime = new AgentRuntime(config);
runtime.configure(PayloadCMSAgent, { payload: payload });

// Call Prepare
await runtime.prepare();


// Notify Events 
runtime.notify({ event: "message", chat: 123214 });
await sleep(500);
runtime.notify({ event: "message", chat: 123214 });


// Shut Down
await runtime.shutdown();


```
