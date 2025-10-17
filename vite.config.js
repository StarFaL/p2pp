import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,          // ⚡ фронт работает тут
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:5000'  // ⚡ проксируем к бэку
    }
  }
})
