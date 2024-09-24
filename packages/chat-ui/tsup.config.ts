import { defineConfig } from 'tsup'
import { preserveDirectivesPlugin } from 'esbuild-plugin-preserve-directives';

export default defineConfig({
  entry: ['src/index.ts', 'src/fixtures.ts'],
  splitting: false,
  format:['esm', 'cjs'],
  sourcemap: true,
  clean: true,
  dts:true,
  metafile: true, // improving the accuracy
  esbuildPlugins: [
    preserveDirectivesPlugin({
      directives: ['use client', 'use strict'],
      include: /\.(js|ts|jsx|tsx)$/,
      exclude: /node_modules/,
    }),
  ],
})