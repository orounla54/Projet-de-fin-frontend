import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@tailwindConfig': resolve(__dirname, 'tailwind.config.js'),
    },
  },
  optimizeDeps: {
    include: [
      '@tailwindConfig',
    ]
  }, 
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_BASE_URL_API || 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  base: '/'
})
