/* eslint-disable import/order */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  root: './src',
  envDir: '../',
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
