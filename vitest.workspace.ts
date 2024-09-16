import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
	'./packages/semantic-search/vite.config.ts',
	'./packages/llm-utils/vite.config.ts',
	'./packages/chat/vite.config.ts',
	'./packages/llm-tools/vite.config.ts',
])
