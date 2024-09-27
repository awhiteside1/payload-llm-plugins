// services.ts

import { Effect, Context, Layer } from "effect";
import { ChatRequest, ChatResponse, Message, Ollama } from "ollama";

/**
 * LLMService tag
 */
export class LLMService extends Context.Tag("LLMService")<
  LLMService,
  {
    readonly chat: (
      req: ChatRequest,
    ) => Effect.Effect<ChatResponse, Error, never>;
    readonly generateText: (
      prompt: string,
      model: string,
    ) => Effect.Effect<string, Error, never>;
    readonly getEmbedding: (
      text: string,
    ) => Effect.Effect<number[], Error, never>;
  }
>() {}

/**
 * Layers providing service implementations.
 */
export const LLMServiceLive = () => {
  const ollama = new Ollama();

  return Layer.succeed(
    LLMService,
    LLMService.of({
      chat: (request: ChatRequest) =>
        Effect.tryPromise({
          try: () => ollama.chat({ ...request, stream: false }),
          catch: (err) => new Error('unknown'),
        }),
      generateText: (prompt: string, model: string) =>
        Effect.tryPromise({
          try: () =>
            ollama
              .generate({
                prompt,
                model,
                stream: false,
              })
              .then((x) => x.response),
          catch: () => new Error(),
        }),
      getEmbedding: (text: string) =>
        Effect.tryPromise({
          try: () =>
            ollama
              .embed({ model: "nomic-embed-text", input: text })
              .then((res) => res.embeddings[0]),
          catch: (err) => new Error(),
        }),
    }),
  );
};

/**
 * Defines the application layer by composing service layers.
 */
export const AppLayer = Layer.mergeAll(LLMServiceLive());
