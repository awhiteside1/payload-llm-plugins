import * as React from "react";
import {MessageElement} from './Message'
import type {Message} from './types'

interface ChatProps {
	// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
	chat:Promise<{messages: Message[]}|void>
}

export const ChatUI = ({ chat }: ChatProps) => {

	const messages = React.use(chat)

	return (
		<div className="flex-grow flex flex-col gap-2 ">
			<div className="chat-messages">
				{messages?.messages?.map((message) => (
					<MessageElement key={message.message} message={message} />
				))}
			</div>
			<div className="chat-input"><form id="chat"><label htmlFor="chat-input">Input Your Query</label><input name="chat-input" id="chat-input"/></form></div>
		</div>
	)
}
