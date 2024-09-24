import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import dts from "vite-plugin-dts";
import { externalizeDeps } from "vite-plugin-externalize-deps";

import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    // @ts-ignore
    tsconfigPaths(),
    react(),
    libInjectCss(),
    externalizeDeps(),
    dts({
      outDir: ["dist/types"],
      tsconfigPath: "./tsconfig.lib.json",
    }),
  ],
  build: {
    outDir: "dist/ui/page",
    sourcemap: true,
    lib: {
      entry: ["./src/ui/page/ChatView.tsx"],
      formats: ["es", "cjs"],
    },
    minify: false,
    emptyOutDir:false
  },
  test: {
    globals: true,
  },
});
