import * as React from "react";
import {MessageElement} from './Message'
import type {Message} from './types'

interface ChatProps {
	// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
	chat:Promise<{messages: Message[]}|void>
}

export const ChatUI = ({ chat }: ChatProps) => {

	const messages = React.use(chat)
	console.log(messages)
	return (
		<div className="flex-grow flex flex-col gap-2">
			<div className="chat-messages flex-grow overflow-y-auto p-4 space-y-2">
				{messages?.messages?.map((message) => (
					<MessageElement key={message.message} message={message} />
				))}
			</div>
			<div className="chat-input p-4 bg-gray-100">
				<form id="chat" className="flex">
					<label htmlFor="chat-input" className="sr-only">Input Your Query</label>
					<input name="chat-input" id="chat-input" className="flex-grow p-2 border border-gray-300 rounded-l" placeholder="Type your message..." />
					<button type="submit" className="p-2 bg-blue-500 text-white rounded-r">Send</button>
				</form>
			</div>
		</div>
	)
}
