import {defineConfig} from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [tsconfigPaths()],
	build: {
		sourcemap: 'inline',
	},

	test: {
		disableConsoleIntercept: true,
		globals: true,
	},
})
