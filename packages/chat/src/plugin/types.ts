import type {Client} from '../llm/clients'
import type {CollectionConfig} from "payload";
import type {PartialDeep} from "type-fest";

type CollectionSettings = {
	enable: boolean | Readonly<Array<'read' | 'write' | 'delete'>>
}

export type ChatPluginConfig = {
	enabled: boolean
	ui: {
		enabled: boolean
	}
	modelClientConfig: Client
	collectionSettings: CollectionSettings | Record<string, CollectionSettings>
	generatedCollections: {
		chats: {
			slug: string
			overrides: PartialDeep<CollectionConfig>
		}
	}
}
