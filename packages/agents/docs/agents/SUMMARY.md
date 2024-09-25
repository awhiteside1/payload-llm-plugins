An Agent is an class which includes prompts, tools, directives and preferred LLM Model settings.

Agents come in different varieties: Execution Agents, Reasoning Agents, Experts, and  Director Agents.

Executor Agents
- Perform unambiguous tasks that require interacting with systems.
- Can invoke their tools
- Have strategies / Common rules
- Stateless
- Examples: SQL Agent, CMS Agent, Web Search Agent, SERP Agent, Executor Builder Agent

Reasoners
- Attempts to outline steps one level deeper  which will likely achieve the goal
- Defines the building blocks and conditionals in the problem space
- Stores success/fail/cost of each kind of step for weighting future
- Examples: Solution Planner, Intent Refiner, Researcher, Action Planner

Experts
- Reviews transition data between agents.
    - ACCEPT - the output meets the criteria / is viable
    - REJECT - the output does not meet the criteria or has large flaw
    - ESCALATE  - Increases LLM Ranking or
- Estimate or gut check results
- Determine Significance / Precision Required
- Examples: Expert Expert, E-commerce Expert, Marketing Expert

Directors
- Maintains status, monitors token usage/time, assigns work
- Reviews new information / results and decides if it changes anything
- Recommends resources / creates
- Estimates difficulty
- Singletons / Stateful
  Examples: Process Monitor (keeps track of activities, progress, tokens used, agent performance), Task Assigner, Messaging Agent (communicates with user), Scribe
