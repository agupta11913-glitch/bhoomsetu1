import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendTarget = env.VITE_API_URL || env.VITE_DEV_BACKEND_URL || 'http://localhost:8080'

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 3000,
      open: false,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
