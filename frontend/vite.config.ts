import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      shimMissingExports: true,
    },
  },
  server: {
    host: true,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
