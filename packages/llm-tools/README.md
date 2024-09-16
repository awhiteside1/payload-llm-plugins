# LLM Tools Plugin

## Purpose

Defines LLM Friendly Tools allowing LLMs to interact with Payload CMS on behalf of the user.  
Intended for use with [@payload-llm-plugins/chat](../chat/README.md), but compatible with many frameworks.

### Use Cases

- Autofill drafts with content
- Updates existing items with reasonable defaults for a new field
- Complex searches using natural language

### How it Works

- Allows LLMs to respond with a [tool](#available-tools) to invoke

## Available Tools

| Tool          | Description                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| Create Record | Creates a new record in the specified collection with provided data         |
| Update Record | Modifies an existing record in the specified collection with new data       |
| Query Records | Performs a search or retrieval operation on records based on given criteria |
| Generate Link | Creates a URL or reference to a specific record or resource in the CMS      |
