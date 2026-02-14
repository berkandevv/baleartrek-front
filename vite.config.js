import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = String(env.VITE_API_BASE_URL || '').trim()
  const isRelativeApiBase = apiBaseUrl.startsWith('/')
  const apiProxyTarget = String(env.VITE_API_PROXY_TARGET || 'http://localhost:8000').trim()

  return {
    plugins: [react()],
    server: {
      proxy: isRelativeApiBase
        ? {
            [apiBaseUrl]: {
              target: apiProxyTarget,
              changeOrigin: true,
              secure: false,
            },
            '/images': {
              target: apiProxyTarget,
              changeOrigin: true,
              secure: false,
            },
            '/storage': {
              target: apiProxyTarget,
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
    },
  }
})
