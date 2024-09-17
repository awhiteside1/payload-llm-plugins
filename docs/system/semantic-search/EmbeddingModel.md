# Embedding Model

## Purpose

Convert chunks of text into comparable vectors for indexing and semantic serach.

## Integration

Integrated with the VectorStore to automatically embed queries/index documents as they are added. Provided in the form of a class

```ts

class CustomEmbeddingModel extends EmbeddingModel {

    private model = new ModelClient();

    generateEmbeddings(texts: string[]): number[] {
        return this.model.embed(text);
    }

    numberOfDimensions() {
        return 768;
    }

}

```

## Included Integrations

- Ollama
- OpenAI
