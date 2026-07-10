import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react(), tailwindcss()],
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
    watch: {
      usePolling: true,
    },
    // SPA fallback: serve index.html for all routes so client-side routing works
    appType: 'spa',
  },
});
