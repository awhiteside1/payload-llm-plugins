# LLM Utils

## Purpose

Common types and functions related to LLMs that can be used throughout the repo and bundled into packages as used.

## Use Cases

- Better search for editors
- Better search for end users
- Automatic 'related documents'

## How it works

- Configure a Vector DB and an Embedding LLM
- Configure the fields to index (can be virtual)
- Each field (on create and update) is embedded and stored in the vector db referencing the original ID
- Exposes a lookup function and an enhanced search UI
