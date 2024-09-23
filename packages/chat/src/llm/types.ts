import type {ChatCompletionMessageParam, ChatCompletionMessage} from "openai/resources/chat/completions";

export interface LLMClient{
    chat(messages:Array<ChatCompletionMessageParam>):Promise<ChatCompletionMessage>
}

export interface EmbeddingClient {
    embed(text:Array<string>): Promise<Array<Array<number>>>
}