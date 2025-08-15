import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: [/src\/admin\/.+\.(jsx?|tsx?)$/],
    }),
    {
      name: "admin-spa-fallback",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.originalUrl || "";
          const isAdminPath = url.startsWith("/admin");
          const looksLikeFile = /\.[a-zA-Z0-9]+($|\?)/.test(url);
          if (isAdminPath && !looksLikeFile) {
            req.originalUrl = "/admin/index.html";
          }
          next();
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        admin: path.resolve(__dirname, "admin.html"),
      },
      output: {
        // optional: nudge vendor chunking so admin deps don’t leak into vanilla
        // manualChunks(id) {
        //   if (id.includes("node_modules")) {
        //     if (id.includes("react") || id.includes("react-router")) {
        //       return "vendor_admin";
        //     }
        //     return "vendor";
        //   }
        // },
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  server: {
    port: 5173,
  },
});
