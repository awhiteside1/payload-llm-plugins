import type {ChatResponse, Message} from 'ollama'
import {isArray, last} from 'radash'
import type {ToolObject} from '../tools/tools'
import type {GenerateOptions, GenerationResult} from './types'
import {consola} from "consola";

const isMessageChainComplete = (messages: Array<Message>) => {
	const lastMessage = last(messages)
	const isAssistant = lastMessage?.role === 'assistant'
	const hasTools =
		isArray(lastMessage?.tool_calls) && lastMessage.tool_calls.length > 0
	return isAssistant && !hasTools
}

const createToolCaller = (tools: Array<ToolObject>) => {
	const toolsMap = new Map(tools.map((tool) => [tool.name, tool]))

	return async (response: ChatResponse): Promise<Array<Message>> => {
		if (!response.message.tool_calls) return []
		const invocations = []
		for (const toolCall of response.message.tool_calls) {
			const tool = toolsMap.get(toolCall.function.name)
			if (tool) {
				consola.debug(`Invoking ${tool?.name} with arguments ${toolCall.function.arguments}`)
				const toolMessage = tool.invoke(toolCall.function.arguments)
				invocations.push(toolMessage)
			} else {
				invocations.push(
					Promise.resolve({
						role: 'tool',
						content: `${toolCall.function.name} is not a valid tool. `,
					}),
				)
			}
		}
		return Promise.all(invocations)
	}
}

export const generate = async ({
	llm,
	message,
	tools,
	model,
	systemMessage,
}: GenerateOptions): Promise<GenerationResult> => {
	const messages = [
		{ role: 'system', content: systemMessage },
		{ role: 'user', content: message },
	]
	const toolDetails = tools.map((tool) => tool.describe())
	const processTools = createToolCaller(tools)
	do {
		const response = await llm.chat({
			model,
			stream: false,
			tools: toolDetails,
			keep_alive: '10m',
			messages,
		})
		messages.push(response.message)
		const toolMessages = await processTools(response)
		messages.push(...toolMessages)
	} while (!isMessageChainComplete(messages))
	const output = messages.at(-1)?.content
	if (output) {
		console.debug('Chat generation completed')
		return { conversation: messages, output: output }
	}
	console.error('Chat generation failure', messages)

	throw new Error('Error')
}
