import { JSONSchema, Schema } from "@effect/schema";
import { Message, Ollama, Tool, ToolCall } from "ollama";
import { isString } from "radash";

interface ToolOptions<
  T extends Schema.Schema.AnyNoContext,
  K extends Schema.Schema.AnyNoContext = typeof Schema.String,
> {
  params: T;
  output?: K;
  implementation: (args: Schema.Schema.Type<T>) => Promise<K>;
  name: string;
  description: string;
}

export interface ToolObject {
  name: string;
  describe: () => Tool;
  invoke: (args: string | ToolCall['function']['arguments']) => Promise<Message>;
}

export const createTool = <
  T extends Schema.Schema.AnyNoContext,
  K extends Schema.Schema.AnyNoContext,
>({
  description,
  implementation,
  output,
  params,
  name,
}: ToolOptions<T, K>): ToolObject => {
  const args = JSONSchema.make(params);
  const parser = Schema.decodeSync(params);
  const describe = (): Tool => {
    return {
      type: "function",
      //@ts-ignore
      function: { parameters: args, name, description },
    };
  };

  const invoke:ToolObject['invoke'] = async (args) => {
    const params = isString(args) ? parser(args) : args;
    const result = await implementation(params);
    return { role: "tool", content: JSON.stringify(result) };
  };

  return {
    name,
    describe,
    invoke,
  };
};
