import '../tailwind.css'

import type {AdminViewProps} from 'payload'
//@ts-ignore
// biome-ignore lint/style/useImportType: <explanation>
import  * as React from 'react'
import {ReactNode, Suspense} from 'react'
import {DefaultTemplate} from '@payloadcms/next/templates'
import {redirect} from 'next/navigation'
import {ChatUI} from '../chat'
import {ConversationsList} from './ConversationsList'

const ChatView: React.FC<AdminViewProps> = ({
	initPageResult,
	params,
	searchParams,
}: AdminViewProps): ReactNode => {

	const {
		permissions,
		req: {
			payload,
			payload: {
				config: {
					routes: { admin: adminRoute },
				},
			},
			user,
		},
		visibleEntities,
	} = initPageResult

	if (!user || (user && !permissions?.canAccessAdmin)) {
		return redirect(`${adminRoute}/unauthorized`)
	}

	const conversations = payload
		.find({ collection: 'chats', where: { description:{exists:true} } })
		.then((chat) => {
			return chat.docs.map((c) => ({
				id: c.id.toString(),
				description: c.description,
			}))
		}).catch(console.error)

	const chatId = 1
	const chat = chatId
		? payload
				.find({
					collection: 'chats',
					where: { id: { equals: chatId } },
				})
				.then((chats) => {
					console.log(chats)
					const chat = chats.docs[0]
					console.log(chat)

					if (!chat) return { messages: [] }
					return { ...chat, messages: chat.messages }
				}).catch(console.error)
		: Promise.resolve({ messages: [] })

	return (
		<>
			<div className="flex flex-col h-screen">
				<header className="bg-gray-800 text-white p-4">
					<h1 className="text-xl">Conversations</h1>
				</header>
				<div className="flex flex-grow overflow-hidden">
					<aside className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
						<Suspense fallback={<p>Loading</p>}>
							<ConversationsList conversations={conversations} />
						</Suspense>
					</aside>
					<main className="flex-grow p-4 flex flex-col">
						<Suspense fallback={<p>Loading</p>}>
							<ChatUI chat={chat} />
						</Suspense>
					</main>
				</div>
			</div>
		</>
	)
}

export default ChatView