import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "none-wsy",
    project: "pokemon-center"
  })],

  define: {
    // Provide a polyfill for process.env
    "process.env": {},
    // If you need specific environment variables, you can add them here:
    // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },

  build: {
    sourcemap: true
  }
});