import {toMarkdownTable} from '../md/utils'
import {InjectSection} from '../ChatEngine/utils/injectSection'
import {mapValues} from 'radash'


const systemContext = [
	'Your responses will only be seen by other Agents, avoid small talk.',
	'Be precise, follow instructions, invoke relevant tools if they could improve the quality of your response, and avoid rambling.',
	'If a schema is provided, ensure you include json data with all properties.',
	'Never omit relevant information.'
]


const tooluse = [
	'You may be provided tools which you may choose to invoke to complete this task.',
	'If you choose to invoke a tool, it will be executed and the result appended as a message in the chat history.',
	'While using appropriate tools and information from their responses to complete the task is encouraged, do not reference your use of the tool in your final response.',
].join('\n')

export const Prompts = {

	toolUse: InjectSection('Tools', tooluse),
}
