import { defineConfig } from "vitest/config";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { externalizeDeps } from "vite-plugin-externalize-deps";

import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), libInjectCss(), externalizeDeps()],
  build: {
    outDir: "dist",
    sourcemap: true,
    lib: {
      entry: ["./index.ts"],
      formats: ["es", "cjs"],
    },
  },
  test: {
    globals: true,
  },
});
