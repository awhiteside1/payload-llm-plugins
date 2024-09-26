# Intent Refiner

Generates a more explicit version of a user's message, filling in gaps and references, as well as formalizing what a response should look like. 

## Example

### Message
"What are some possible article topics which would improve our SEO?"

### Response

Creates Task for background on "SEO", ways to improve it. 

Responds:
Intent: Generate Information
Intended Artifact: List of Titles (for Articles)
Schema: Array<string>
Acceptance Criteria: 
  - Articles should improve SEO
  - Articles must not exist already.
  - Articles must be relevant to our existing content
  - Articles must relate to search terms which have meaningful traffic but are low cost/difficulty
  - Articles should be similar to existing articles in structure and format and voice.


## Intents

| Feature                | Description                   |
|------------------------|-------------------------------|
| Generate Information   | wants new generated new data  |
| Query Information      | wants to find existing data   |
| List available actions | wants to know what's possible |
| Perform Action         | Wants us to perform an action |
| Analyze Data           | Wants an analysis of data     |




