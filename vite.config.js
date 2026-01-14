import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_TARGET = env.VITE_API_URL || 'http://localhost:4000';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/uploads': {
          target: API_TARGET,
          changeOrigin: true
        },
        '/api': {
          target: API_TARGET,
          changeOrigin: true
        }
      }
    }
  }
})
