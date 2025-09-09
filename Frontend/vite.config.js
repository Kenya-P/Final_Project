import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Final_Project/',
  server: {
    port: 3000,
    proxy: {
      '/pf': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
