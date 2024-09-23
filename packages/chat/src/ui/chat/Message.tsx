import * as React from 'react'
import type {Chat} from '../../payload-types'

export const MessageElement = ({
	message,
}: { message: Chat['messages'][number] }) => {
	return (
		<div
			className={`chat-message ${message.role === 'user' ? 'text-right' : 'text-left'}`}
		>
			<div
				className={`chat-bubble inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
				data-role={message.role}
			>
				{message.text}
			</div>
		</div>
	)
}
