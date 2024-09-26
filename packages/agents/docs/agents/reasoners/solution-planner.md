# Solution Planner 

Based on the extracted intent, creates a plan to achieve it. 

## General Algorithm

Identify any information referred to explicitly, add to plan.

Identify if an expert would provide a process or important information. 

Work Backwards from the desired intent to a list of necessary primitives. Add steps to get the primitives "somehow". 



## Example 

Intent based on [Intent Example](./intent-refiner.md)

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