import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ["**/.vercel/**"],
    },
    proxy: {
      "/api": {
        // Proxies to the local Python API dev server (api/serve.py)
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
