import {getPayload} from 'payload'
import type {Chat, User} from '../../payload-types'
import {headers} from 'next/headers'
import config from '@payload-config'
import {get, isString} from 'radash'
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'

interface Props {
	message: string
	chatId?: string | number
	user: User
}

export async function insertMessageAction(data: FormData) {
	'use server'

	const instance = await getPayload({ config })
	const auth = await instance.auth({ headers: headers() })

	const user = auth.user

	const message = data.get('message')
	if (!user || !isString(message)) return
	const chatId = data.get('chatId')?.toString()

	const chat =
		chatId &&
		(await instance.findByID({ collection: 'chats', id: chatId, depth: 0 }))
	if (chat) {
		chat.messages.push({ text: message, role: 'user' })
		await instance.update({
			collection: 'chats',
			data: chat,
			id: chatId,
		})
	} else {
		const chat = {
			messages: [{ role: 'user', text: message }],
			user: get<number>(user, 'id'),
		} satisfies Partial<Chat>
		const newChat = await instance.create({
			collection: 'chats',
			data: chat,
			user,
		})
		const id = get<number>(newChat, 'id')
		redirect(`/admin/chat/${id}`)
	}

	revalidatePath(`/admin/chat/${chatId}`)
}
