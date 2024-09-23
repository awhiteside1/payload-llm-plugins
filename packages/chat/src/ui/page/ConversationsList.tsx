import * as React from 'react'
import { use } from "react";

interface ConversationsListProps {
	// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
	conversations: Promise<Array<{ description: string; id: string }>|void>
}

export const ConversationsList = ({
	conversations,
}: ConversationsListProps) => {

	const convos = use(conversations)
	return (
		<div className="conversations-list space-y-2">
			{convos?.map((convo) => (
				<a key={convo.id} href={`#${convo.id}`} className="block p-2 bg-white rounded shadow hover:bg-gray-200">
					<div className="conversation">
						<p className="text-gray-800">{convo.description}</p>
					</div>
				</a>
			))}
		</div>
	)
}
