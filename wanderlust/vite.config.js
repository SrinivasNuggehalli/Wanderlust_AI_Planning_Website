import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Allows the server to accept requests from any host
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: "ws", // Use WebSocket for HMR
      clientPort: 5173,
    },
  },
});
