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
		<div className="conversations-list">
			{convos?.map((convo) => (
				<a key={convo.id} href={`#${convo.id}`}>
					<div className="conversation">
						<p>{convo.description}</p>
					</div>
				</a>
			))}
		</div>
	)
}
