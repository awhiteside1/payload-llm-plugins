import * as React from 'react'
import {use} from 'react'
import {get} from 'radash'
import type {PayloadRequest} from 'payload'
import {queryChats} from '../hooks/queryConversations'

interface ConversationsListProps {
	req: PayloadRequest
	chatId: undefined | string | number
}

export const ConversationsList = ({ req, chatId }: ConversationsListProps) => {
	const conversations = queryChats(req)

	const convos = use(conversations)
	return (
		<div className="conversations-list space-y-2">
			{convos?.map((convo) => (
				<a
					key={get(convo, 'id')}
					href={`./${get(convo, 'id')}`}
					data-selected={String(get(convo, 'id')) === String(chatId)}
					className="block p-2 bg-white rounded shadow hover:bg-gray-200 "
				>
					<div className="conversation">
						<p className="text-gray-800">{convo.description}</p>
					</div>
				</a>
			))}
		</div>
	)
}
