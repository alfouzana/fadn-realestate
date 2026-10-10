import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// base "./" = relative asset paths, so the site works at https://user.github.io/repo/
export default defineConfig({
  base: "./",
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        // add more pages here, e.g. about: resolve(__dirname, "about.html"),
      },
    },
  },
});
