import type {Config} from 'payload'
import type {ChatPluginConfig} from './types'
import {setupChatContext} from './context'
import {providers} from '../llm/providers'
import {createMessageCollection} from '../collections/createMessageCollection'
import {defu} from 'defu'

export const chatPlugin =
	(incomingPluginConfig: Partial<ChatPluginConfig>) =>
	async (config: Config): Promise<Config> => {
		const pluginConfig: ChatPluginConfig = defu(incomingPluginConfig, {
			enabled: true,
			generatedCollections: {
				chats: {
					slug: 'chats',
					overrides: {},
				},
			},
			collectionSettings: {
				enable: true,
			},
			modelClientConfig: {
				provider: 'ollama',
				host: 'http://studio.local:11434',
			},
			ui: { enabled: true },
		} satisfies ChatPluginConfig)

		if (!pluginConfig.enabled) {
			console.log('plugin not enabled')
			return config
		}

		const updatedConfig = defu(config, {
			admin: {
				components: {
					views: {
						chat: {
							exact:true,
							sensitive:false,
							path:'/chat',
							Component: '@payload-llm-plugins/chat/ChatView',
						},
					},
				},
			},
			collections: [
				createMessageCollection(
					pluginConfig.generatedCollections.chats,
				),
			],
		} satisfies Partial<Config>)
		console.log(updatedConfig.admin.components.views.chat)
		const clientConfig = pluginConfig.modelClientConfig

		// @ts-ignore
		const client = await providers[clientConfig.provider](clientConfig)

		return setupChatContext(updatedConfig, {
			embeddingClient: client,
			llmClient: client,
		})
	}
