import type {ChatPluginConfig} from '../plugin/types'
import type {ArrayField, CollectionConfig, FieldHook} from 'payload'
import {get} from 'radash'

const setSentDate: FieldHook<
	{ id: string },
	Array<{ sent: Date; id: string }>
> = ({ data, value, operation }) => {
	return (value ?? []).map((m) => ({ ...m, sent: m.sent ?? new Date() }))
}

export const createMessageCollection = (
	config: ChatPluginConfig['generatedCollections']['chats'],
): CollectionConfig => {
	const slug = get(config, 'chats', 'chats')

	const messagesField: ArrayField = {
		name: 'messages',
		type: 'array',
		required: true,
		defaultValue: [],
		hooks: {
			beforeChange: [setSentDate],
		},
		fields: [
			{
				type: 'row',
				fields: [
					{
						name: 'sent',
						type: 'date',
						admin: { date: { pickerAppearance: 'dayAndTime' }, readOnly: true },
					},
					{
						name: 'role',
						type: 'select',
						options: ['assistant', 'user'],
						required: true,
					},
				],
			},
			{ name: 'text', type: 'text', required: true },
			{
				label: 'context',
				type: 'collapsible',
				admin: { initCollapsed: true },
				fields: [
					{ name: 'collection', type: 'text' },
					{ name: 'view', type: 'select', options: ['list', 'record'] },
				],
			},
		],
	}

	return {
		access: {
			read: ({ req, data }) => {
				if (!req.user) return false
				if (!data) return true
				return {
					'user.email': { equals: req.user.email },
				}
			},
		},
		fields: [
			messagesField,
			{
				name: 'user',
				type: 'relationship',
				relationTo: 'users',
				hasMany: false,
				required: true,
			},
			{
				name: 'description',
				type: 'text',
				defaultValue: 'A Recent Chat',
			},
		],
		slug,
	}
}
