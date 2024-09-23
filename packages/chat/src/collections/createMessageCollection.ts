import type {ChatPluginConfig} from '../plugin/types'
import type {ArrayField, CollectionConfig} from 'payload'
import {get} from 'radash'

export const createMessageCollection = (
	config: ChatPluginConfig['generatedCollections']['chats'],
): CollectionConfig => {
	const slug = get(config, 'chats', 'chats')

	const messagesField: ArrayField = {
		name: 'messages',
		type: 'array',
		fields: [
			{ name: 'sent', type: 'date', required: true },
			{ name: 'text', type: 'text', required: true },
			{
				name: 'role',
				type: 'select',
				options: ['assistant', 'user'],
				required: true,
			},
			{
				name: 'context',
				type: 'group',
				fields: [
					{ name: 'collection', type: 'text' },
					{ name: 'view', type: 'select', options: ['list', 'record'] },
				],
			},
		],
	}

	return {
		fields: [
			messagesField,
			{
				name: 'user',
				type: 'relationship',
				relationTo: ['users'],
				required: true,
			},
			{
				name:'description',
				type:'text',
				defaultValue:'A Recent Chat'
			}
		],
		slug,
	}
}
