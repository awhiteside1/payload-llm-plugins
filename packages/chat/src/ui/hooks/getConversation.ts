import type {PayloadRequest} from 'payload'
import type {Chat} from '../../payload-types'
import {isObject} from 'radash'

export const getChat = async (
	req: PayloadRequest,
	id: string | number | undefined | null,
): Promise<Chat | Pick<Chat, 'messages'>> => {
	if (!id) {
		return Promise.resolve({ messages: [] })
	}

	const conversation = await req.payload.findByID({
		overrideAccess: false,
		user: req.user,
		id,
		depth: 2,
		collection: 'chats',
	})
	if (
		conversation &&
		isObject(conversation.user) &&
		conversation.user.email === req.user?.email
	) {
		return conversation
	}
	return { messages: [] }
}
