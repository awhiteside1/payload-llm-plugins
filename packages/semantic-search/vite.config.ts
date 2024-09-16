import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [tsconfigPaths()],

	test: {
		globalSetup: ['./e2e/_setup/vitest.ts'],
		globals: true,
	},
})
