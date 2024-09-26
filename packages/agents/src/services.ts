// services.ts

import { Effect, Context, Layer } from "effect";
import { LogEvent, ProcessStatus, Article } from "./types";
import { Ollama } from "ollama";

/**
 * LLMService tag
 */
export class LLMService extends Context.Tag("LLMService")<
  LLMService,
  {
    readonly generateText: (
      prompt: string,
      model: string,
    ) => Effect.Effect<any, Error, string>;
    readonly getEmbedding: (
      text: string,
    ) => Effect.Effect<any, Error, number[]>;
  }
>() {}

/**
 * VectorStoreService tag
 */
export class VectorStoreService extends Context.Tag("VectorStoreService")<
  VectorStoreService,
  {
    readonly storeVector: (
      id: string,
      vector: number[],
    ) => Effect.Effect<any, Error, void>;
    readonly queryVector: (
      vector: number[],
      topK: number,
    ) => Effect.Effect<any, Error, string[]>;
  }
>() {}

/**
 * CMSService tag
 */
export class CMSService extends Context.Tag("CMSService")<
  CMSService,
  {
    readonly fetchArticles: (args: any) => Effect.Effect<any, Error, Article[]>;
    readonly checkArticleExists: (
      title: string,
    ) => Effect.Effect<any, Error, boolean>;
  }
>() {}

/**
 * DatabaseService tag
 */
export class DatabaseService extends Context.Tag("DatabaseService")<
  DatabaseService,
  {
    readonly logEvent: (event: LogEvent) => Effect.Effect<any, Error, void>;
    readonly getProcessStatus: (
      processId: string,
    ) => Effect.Effect<any, Error, ProcessStatus>;
    readonly updateProcessStatus: (
      processId: string,
      status: ProcessStatus,
    ) => Effect.Effect<any, Error, void>;
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
              .then((res) => res.embeddings),
          catch: (err) => new Error(),
        }),
    }),
  );
};

export const VectorStoreServiceLive = Layer.succeed(
  VectorStoreService,
  VectorStoreService.of({
    storeVector: (id: string, vector: number[]) => Effect.succeed(void 0),
    queryVector: (vector: number[], topK: number) =>
      Effect.succeed(["id1", "id2"]),
  }),
);

export const DatabaseServiceLive = Layer.succeed(
  DatabaseService,
  DatabaseService.of({
    logEvent: (event: LogEvent) => Effect.succeed(void 0),
    getProcessStatus: (processId: string) =>
      Effect.succeed({ id: processId, status: "in-progress" }),
    updateProcessStatus: (processId: string, status: ProcessStatus) =>
      Effect.succeed(void 0),
  }),
);

export const CMSServiceLive = Layer.succeed(
  CMSService,
  CMSService.of({
    fetchArticles: (args: any) =>
      Effect.succeed([
        { id: "1", title: "Existing Article 1", content: "Content 1" },
        { id: "2", title: "Existing Article 2", content: "Content 2" },
      ]),
    checkArticleExists: (title: string) => Effect.succeed(false),
  }),
);

/**
 * Defines the application layer by composing service layers.
 */
export const AppLayer = Layer.mergeAll(
  LLMServiceLive(),
  VectorStoreServiceLive,
  DatabaseServiceLive,
  CMSServiceLive,
);
