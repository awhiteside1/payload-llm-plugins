import * as React from 'react'
import {MessageElement} from './Message'
import type {PayloadRequest} from 'payload'
import {getChat} from '../hooks/getConversation'
import {SendMessageUI} from './Input.client'

interface ChatProps {
	req: PayloadRequest
	chatId: string | number | undefined
}

export const ChatUI = ({ req, chatId }: ChatProps) => {
	const chat = getChat(req, chatId)
	const messages = React.use(chat)
	return (
		<div className="flex-grow flex flex-col gap-2">
			<div className="chat-messages flex-grow overflow-y-auto p-4 space-y-2">
				{messages?.messages?.map((message) => (
					<MessageElement key={message.text} message={message} />
				))}
			</div>
			<div className="chat-input p-4 bg-gray-100">
				<SendMessageUI chatId={chatId} />
			</div>
		</div>
	)
}
