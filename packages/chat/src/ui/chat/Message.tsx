import * as React from 'react'
import type {Message} from './types'

export const MessageElement = ({ message }: { message: Message }) => {
	return (
		<div className={`chat-message ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
			<div className={`chat-bubble inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`} data-role={message.role}>
				{message.text}
			</div>
		</div>
	)
}
