import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import dts from 'vite-plugin-dts'
import { externalizeDeps } from 'vite-plugin-externalize-deps'

import react from '@vitejs/plugin-react'
export default defineConfig({
	plugins: [tsconfigPaths(), react(),  libInjectCss(),externalizeDeps(), dts({copyDtsFiles:true, outDir:'dist', })],
	build: {
		outDir: 'dist/ui/page',
		lib: {
			entry: ['./src/ui/page/ChatView.tsx'],
			formats: ['es', 'cjs']
		},
	},
	test: {
		globals: true,
	},
})
