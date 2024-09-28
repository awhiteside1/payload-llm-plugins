import type {Section} from './types'

export const sections = {
	structuredData: {
		heading: 'Structured Data',
		purpose:
			'Use this to provide structured data conforming to the schema (JSON Schema).',
		format: 'A json code block containing the valid JSON ',
	},
	unstructuredData: {
		heading: 'Unstructured Data',
		purpose: `Use unstructured data to provide anything requested by the instructions which was not part of the structured data. 
			You may omit this section if the structured data includes everything requested by the task.`,
		format: 'valid markdown',
	},
} satisfies Record<string, Section>
