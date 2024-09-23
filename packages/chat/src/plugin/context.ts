import {createCustomContext} from '@workspace/llm-utils'
import type {EmbeddingClient, LLMClient} from "../llm/types";



export type ChatContext={
    llmClient: LLMClient
    embeddingClient: EmbeddingClient
}

export const [extractChatContext, setupChatContext]=createCustomContext<ChatContext>('LLM_CHAT')