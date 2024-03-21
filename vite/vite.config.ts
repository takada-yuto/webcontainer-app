import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  plugins: [
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
    },
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'src/index.html',
        preview: 'src/preview/index.html',
      },
      output: {
        dir: 'dist',
      },
    },
  }
});