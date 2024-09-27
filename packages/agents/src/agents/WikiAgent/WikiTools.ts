import {config} from 'dotenv'
import {resolve, dirname} from 'pathe'
import {fileURLToPath} from 'node:url'
import { JSONSchema, Schema } from "@effect/schema";
import { createTool } from "../../ChatEngine/tools";
import { get } from "radash";
const localEnv = resolve(dirname(fileURLToPath(import.meta.url)), ".env")
const envVars = config({path:localEnv, processEnv:{}})
const accessToken = get(envVars.parsed,'ACCESS_TOKEN')


const schema = Schema.Struct({
  query: Schema.String.annotations({ description: "The query to search for" }),
});

const searchWikipedia = async (args: Schema.Schema.Type<typeof schema>) => {
  const result = await fetch(
    `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${args.query.toLowerCase()}`,
    {
      headers: {
        "api-user-agent": "Alex Whiteside (https://github.com/awhiteside1)",
        accept: "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    },
  );
  return result.json();
};

const params = JSONSchema.make(schema);

export const WikiSearchTool = createTool({
  name: "search_wikipedia",
  description: "query wikipedia for a given search term or topic",
  implementation: searchWikipedia,
  params: schema,
});
