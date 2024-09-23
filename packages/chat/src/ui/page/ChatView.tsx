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

	const chatId = params?.chat
	const chat = chatId
		? payload
				.find({
					collection: 'chats',
					where: { id: { equals: chatId } },
				})
				.then((chats) => {
					const chat = chats.docs[0]
					if (!chat) return { messages: [] }
					return { ...chat, messages: chat.messages }
				}).catch(console.error)
		: Promise.resolve({ messages: [] })

	return (
		<>
		{/*<script src="https://cdn.tailwindcss.com"/>*/}
	 <div
		 style={{
			 paddingLeft: 'var(--gutter-h)',
					paddingRight: 'var(--gutter-h)',
				}}
			>
				<h1>Conversations</h1>
				<div className="w-full max-h-full flex flex-row flex-grow ">
					<Suspense fallback={<p>Loading</p>}>
					<ConversationsList conversations={conversations} />
					<ChatUI chat={chat} />
					</Suspense>
				</div>
			</div>
		</>
	)

 }


export default ChatView