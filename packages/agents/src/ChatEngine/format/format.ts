import {toMarkdownTable} from '../../md/utils'
import {sections} from './sections'
import {mapValues} from "radash";
import {InjectSection} from "../utils/injectSection";
import {mergePrompts} from "../utils/mergePrompt";

export const responseFormat = [
	"Your response should be in markdown organized into sections by blocks which start with specific Heading Level 2 headings. For example, \n```md\n## MySection \n\n This is my section. \n```\n would be a MySection section with contents 'This is my section' ",
	'The table below lists the valid sections, what heading to use, when to use it (purpose), and how to format their contents.  ',
	toMarkdownTable(Object.values(sections)),
]


const responseSection =  InjectSection(
		{title: 'Response Format Conventions', level:2},
		responseFormat.join('\n'),
	)


export const instructions = [
	"You are a formatting bot, responsible for taking the [response from an LLM](#RESPONSE) generated for a [specific task's instructions](#TASK), and formatting it according to the [response format conventions](#FORMAT_CONVENTIONS).",
	"Do not include any chatter produced by the LLM during planning or explanatory steps unless specifically requested by the task's instructions.",
	"You may only reorganize content to conform with the formating conventions, remove unrelated content, and make changes that do not alter the content's meaning.",
]

export const sectionKeys = mapValues(sections, (section) => section.heading)

export const systemPrompt = mergePrompts(instructions, responseSection)