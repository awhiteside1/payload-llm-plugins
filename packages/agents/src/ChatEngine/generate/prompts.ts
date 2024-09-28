import type {Agent} from '../../Agent/Agent'
import {mergePrompts} from '../utils/mergePrompt'

export const systemContext = mergePrompts(
	'Your responses will only be seen by other Agents, avoid small talk.',
	'Follow instructions, invoke relevant tools if they could improve the quality of your response, ensure your response follows acceptance criteria.',
	'If a schema is provided, ensure you include valid json data with all properties.',
	'Never omit relevant information.',
)

export const buildSystemPromptFor = (
	agent: Agent,
	additional?: Array<string>,
) => mergePrompts(agent.generateAgentPersona(), systemContext, additional)

