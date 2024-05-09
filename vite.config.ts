import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import wasm from "vite-plugin-wasm";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), wasm()],
  resolve: {
    alias: {
      "@cornerstonejs/tools": "@cornerstonejs/tools/dist/umd/index.js",
    },
  },
  worker: {
    plugins() {
      return [wasm()];
    },
  },
});
