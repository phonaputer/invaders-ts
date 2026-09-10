import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@src": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
