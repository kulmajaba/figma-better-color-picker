import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  root: './src',
  publicDir: 'assets/public',
  plugins: [react()],
  build: {
    target: 'esnext',
    outDir: '../dist'
  },
  worker: {
    format: 'es'
  }
});
