# Researcher

Aggregates information for vague requests or requests spanning multiple sources. 

## Example

Continues Example from [Solution Planner](./solution-planner.md)

Request: 
1. Determine details about existing Articles
    - High Level Topics
    - Existing Article Titles (max 20)
      Output is List of Topics, List of Existing Articles


Invokes tool to get agent list, identifying ones which may relate to Articles. 

Create Tasks
1. Query CMS for available collections
2. Find relevant collections for topics and articles
3. Query CMS for records
4. Extract from records 
   5. List of topics
   6. List of Article Titles
