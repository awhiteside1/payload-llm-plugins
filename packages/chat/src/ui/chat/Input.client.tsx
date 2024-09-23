'use client'
import * as React from 'react'
import {insertMessageAction} from './insertMessage.action'

interface ChatId {
	chatId?: string | number
}

export const SendMessageUI = ({ chatId }: ChatId) => {
	return (
		<form id="chat" className="flex" action={insertMessageAction}>
			<label htmlFor="message" className="sr-only">
				Input Your Query
			</label>
			<input
				name="message"
				id="message"
				required
				className="flex-grow p-2 border border-gray-300 rounded-l"
				placeholder="Type your message..."
			/>
			<input hidden id="chatId" name="chatId" readOnly value={chatId} />
			<button type="submit" className="p-2 bg-blue-500 text-white rounded-r">
				Send
			</button>
		</form>
	)
}
