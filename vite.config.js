import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    proxy: {
      '/login': {
        target: 'http://10.5.37.180:2000',
        changeOrigin: true,
        secure: false,
      },
      '/submit': {
        target: 'http://10.5.37.180:2000',
        changeOrigin: true,
        secure: false,
      },
      '/users': {
        target: 'http://10.5.37.180:2000',
        changeOrigin: true,
        secure: false,
      },
      '/whatsapp': {
        target: 'http://10.5.37.180:2000',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://10.5.37.180:2000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
