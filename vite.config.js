import { defineConfig } from "vite";
import { globSync } from "glob";
import injectHTML from "vite-plugin-html-inject";

export default defineConfig(({ command }) => {
  return {
    define: {
      [command === 'serve' ? 'global' : '_global']: {}, // sets the global object
    },
    root: "src", // the root directory (where index.html is located)
    base: "./", // the base of the paths in output directory (what paths in the dist directory are gonna begin with)
    build: {
      rollupOptions: {
        input: globSync("./src/**.html"), // the entry point
      },
      outDir: "../dist", // the output directory (dist folder)
    },
    plugins: [injectHTML()], // plugins
  };
});
