import { ChatResponse, Message, Ollama } from "ollama";
import { ToolObject } from "./tools";
import { isArray, last } from "radash";

interface GenerateOptions {
  llm: Ollama;
  model: string;
  tools: Array<ToolObject>;
  messageHistory: Array<Message>;
}

const isMessageChainComplete = (messages: Array<Message>) => {
  const lastMessage = last(messages);
  const isAssistant = lastMessage?.role === "assistant";
  const hasTools =
    isArray(lastMessage?.tool_calls) && lastMessage.tool_calls.length > 0;
  return isAssistant && !hasTools;
};

const createToolCaller = (tools: Array<ToolObject>) => {
  const toolsMap = new Map(tools.map((tool) => [tool.name, tool]));

  return async (response: ChatResponse): Promise<Array<Message>> => {
    if (!response.message.tool_calls) return [];
    const invocations = [];
    for (const toolCall of response.message.tool_calls) {
      const tool = toolsMap.get(toolCall.function.name);
      if (tool) {
        const toolMessage = tool.invoke(toolCall.function.arguments);
        invocations.push(toolMessage);
      } else {
        invocations.push(
          Promise.resolve({
            role: "tool",
            content: `${toolCall.function.name} is not a valid tool. `,
          }),
        );
      }
    }
    return Promise.all(invocations);
  };
};

export const generate = async ({
  llm,
  messageHistory,
  tools,
  model,
}: GenerateOptions) => {
  const messages = [...messageHistory];
  const toolDetails = tools.map((tool) => tool.describe());
  const processTools = createToolCaller(tools);
  do {
    const response = await llm.chat({
      model,
      stream: false,
      tools: toolDetails,
      messages,
    });
    messages.push(response.message);
    const toolMessages = await processTools(response);
    messages.push(...toolMessages);
  } while (!isMessageChainComplete(messages));

  return messages;
};
