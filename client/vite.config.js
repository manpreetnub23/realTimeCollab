// import path from "path"
// import tailwindcss from "@tailwindcss/vite"
// import react from "@vitejs/plugin-react"
// import { defineConfig } from "vite"

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// })

import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite";
// import sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"), // ✅ Correct relative path
    },
    copyPublicDir: true,
    outDir: "dist",
  },
  // optimizeDeps: {
  //   exclude: ["blogs/*"],
  // },
});