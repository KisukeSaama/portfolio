import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) },
  },
  server: {
    port: 5173,
    proxy: { "/api": { target: process.env.VITE_API_PROXY_TARGET || "http://localhost:8080", changeOrigin: true } },
  },
});
