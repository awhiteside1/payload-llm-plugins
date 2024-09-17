# Vector Store

## Purpose

Efficiently store, index, and query  vector representations of content for semantic search and similarity comparisons.


## Identifier

```ts

type Identifier = {
    documentID: string
    collection: string
    field: string
}

```

## Class Integration

```ts

class MyVectorStore extends VectorDB{
    
    upsert:(id: Identifier, value:string) => Promise<void>
    delete:(id: Identifier) => Promise<void>
    search:(filter: Partial<Identifier>, query: string) => Promise<Identifier &{distance: number}>
    
}

```

## Included Implementation

LanceDB

