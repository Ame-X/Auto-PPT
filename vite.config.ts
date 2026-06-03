import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  // Default off Vite's shared 5173 to dodge cross-project collisions.
  // strictPort: false (Vite's default, pinned here so it stays that way)
  // means a busy port walks up — 5273 → 5274 → … — so dev never fails to
  // start over a port clash. The actual port is printed by `pnpm dev`;
  // read it from there rather than assuming 5273.
  server: {
    port: 5273,
    strictPort: false,
  },
  preview: {
    port: 5273,
    strictPort: false,
  },
});
