import * as React from 'react'
import type {Message} from './types'

export const MessageElement = ({ message }: { message: Message }) => {
	return (
		<div className="chat-message">
			<div className="chat-bubble" data-role={message.role}>
				{message.message}
			</div>
		</div>
	)
}
