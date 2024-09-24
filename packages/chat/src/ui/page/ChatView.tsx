import '../tailwind.css'
import type {AdminViewProps} from 'payload' //@ts-ignore
// biome-ignore lint/style/useImportType: <explanation>
import * as React from 'react'
import {type ReactNode, Suspense} from 'react'
import {redirect} from 'next/navigation'
import {ChatUI} from '../chat'
import {ConversationsList} from './ConversationsList'
import {getParamValue} from './parseParam'
import {get} from "radash";

const ChatView: React.FC<AdminViewProps> = ({
	initPageResult,
	params,
}: AdminViewProps): ReactNode => {
	const {
		permissions,
		req: {
			payload: {
				config: {
					routes: { admin: adminRoute },
				},
			},
			user,
		},
	} = initPageResult

	if (!user || (user && !permissions?.canAccessAdmin)) {
		return redirect(`${adminRoute}/unauthorized`)
	}

	const chatId = get(params,'segments[1]', undefined)


	return (
		<>
			<div className="flex flex-col h-screen">
				<header className="bg-gray-800 text-white p-4">
					<h1 className="text-xl">Conversations</h1>
				</header>
				<div className="flex flex-grow overflow-hidden">
					<aside className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
						<Suspense fallback={<p>Loading</p>}>
							<ConversationsList req={initPageResult.req} chatId={chatId} />
						</Suspense>
					</aside>
					<main className="flex-grow p-4 flex flex-col">
						<Suspense fallback={<p>Loading</p>}>
							<ChatUI req={initPageResult.req} chatId={chatId} />
						</Suspense>
					</main>
				</div>
			</div>
		</>
	)
}

export default ChatView
