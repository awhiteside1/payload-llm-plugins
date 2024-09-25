

An example use case the platform should handle:
- User enters into a (hosted elsewhere) chat: "What are some possible article topics which would improve our SEO?"
- Platform is invoked because the user added a message to a chat. (message and chat are provided)
- Task is created to handle the new message
- Task assigner is invoked because a task has no assignee
- Task assigner assigns the task to Intent Refiner.
- Intent Refiner
    1. Adds to the Task:
       Intent: Generate Information
       Intended Artifact: List of Titles (for Articles)
    2. identifies that SEO understanding is required for fully extracting intent
        - Creates new Task: Gather background about SEO, How to improve it, How articles affect it. High level summary.
        - Pauses refinement task until new task is complete.
    3. Once task is complete and SEO background is available, the refiner updates the original task:
       Requirements: Articles must improve SEO.
       - Articles must not exist already.
       - Articles must be relevant to our existing content
       - Articles must relate to search terms which have meaningful traffic but are low cost/difficulty
       - Articles should be similar to existing articles in structure and format and voice.
- Intent Refiner Yields. Task has no assignee.
- Task assigner assigns Solution Planner
- Solution Planner proposes the following solution:
    1. Determine details about existing Articles
        - High Level Topics
        - Existing Article Titles (max 20)
          Output is List of Topics, List of Existing Articles
    2. Bring in SEO Expert to
        - Validate Relevant information
        - Reframe topics as SEO terms
        - Generate example terms
        - Provide details on how to find Cost and Difficulty per term
          Output is  Further Guidance, Example Search Terms, Topics
    3. Plan actions based on guidance and agents
        - Read Only Actions
        - Verify with Expert
        - Output should be list of viable search terms to target
    4. Generate Article Titles (3-5)  that match search terms
        - Similar in structure to existing articles  retrieved earlier
        - Verify article doesn't already exist
    5. Present articles to user
- Solution Planner Yields
- Task planner assigns
  ...
