// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  publicDir: "public", // ✅ static assets live here
  build: {
    outDir: "dist", // ✅ BUILD OUTPUT
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // Three.js is inherently large
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          "react-three": ["@react-three/fiber", "@react-three/drei", "@react-three/cannon"],
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
});
