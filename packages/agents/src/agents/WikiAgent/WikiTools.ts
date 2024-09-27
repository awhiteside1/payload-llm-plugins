import { config } from "dotenv";
import { resolve, dirname } from "pathe";
import { fileURLToPath } from "node:url";
import { JSONSchema, Schema } from "@effect/schema";
import { createTool } from "../../ChatEngine/tools";
import { first, get } from "radash";
import { PageDetail, Result } from "./types";
import { Effect, pipe } from "effect";
import { wikipedia } from "@agentic/wikipedia";
import Page = wikipedia.Page;

const localEnv = resolve(dirname(fileURLToPath(import.meta.url)), ".env");
const envVars = config({ path: localEnv, processEnv: {} });
const accessToken = get(envVars.parsed, "ACCESS_TOKEN");

const schema = Schema.Struct({
  query: Schema.String.annotations({ description: "The query to search for" })
});

const fetchConfig = {
  headers: {
    "api-user-agent": "Alex Whiteside (https://github.com/awhiteside1)",
    accept: "application/json",
    Authorization: `Bearer ${accessToken}`
  }
};

const getPageSource = async (key: string) =>
  Effect.tryPromise({
    try: async () => {
      const result = await fetch(
        `https://api.wikimedia.org/core/v1/wikipedia/en/page/${key}`,
        fetchConfig
      );
      if (result.ok) {
        const details = await result.json();
        return details as PageDetail;
      }
    },
    catch: error => Effect.fail(new Error("Page Not Retrieved"))
  });


const getWikiSearch =  (query: string) => {
  const params = { q: query.toLowerCase(), limit: "10" };
 return  Effect.tryPromise({
    try: async () => {
      const result = await fetch(
        `https://api.wikimedia.org/core/v1/wikipedia/en/search/page?${new URLSearchParams(params).toString()}`,
        fetchConfig
      );
      const response = await result.json();
      if (response.pages) {
        return Effect.succeed<Result>(response);
      }
      return Effect.fail(new Error('No Pages'))
    },
    catch: error => Effect.fail(new Error("Search Failed"));
  });

};

const searchWikipedia = async (args: Schema.Schema.Type<typeof schema>) => {

  pipe(Effect.succeed(args.query), Effect.map(getWikiSearch), Effect.andThen((result:Result)=> {
    result.pages[0]
  }) )



  const params = { q: args.query.toLowerCase(), limit: "10" };
  const result = await fetch(
    `https://api.wikimedia.org/core/v1/wikipedia/en/search/page?${new URLSearchParams(params).toString()}`,
    fetchConfig
  );
  const response = (await result.json()) as Result;
  const document: Array<string> = [];
  if (response?.pages?.length > 0) {
    const topResult = response.pages[0];
    const data = { key: topResult.key, description: topResult.description };
    document.push([`## ${topResult?.title}`]);
  }

  return response.pages;
};

export const WikiSearchTool = createTool({
  name: "search_wikipedia",
  description: "query wikipedia for a given search term or topic",
  implementation: searchWikipedia,
  params: schema
});
