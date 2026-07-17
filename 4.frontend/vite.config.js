import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/auth': 'http://localhost:5001',
      '/api/products': 'http://localhost:5002',
      '/api/cart': 'http://localhost:5003',
      '/api/orders': 'http://localhost:5004',
      '/api/payments': 'http://localhost:5005',
    }
  }
})