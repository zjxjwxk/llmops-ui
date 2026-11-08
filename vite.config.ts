import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    cors: false, // 禁用 Vite 自带的 CORS 处理，让 OPTIONS 请求能被代理转发
    proxy: {
      '/apps': { target: 'http://161.33.140.139:5001', changeOrigin: true },
      '/builtin-tools': { target: 'http://161.33.140.139:5001', changeOrigin: true },
      '/api-tools': { target: 'http://161.33.140.139:5001', changeOrigin: true },
      '/upload-files': { target: 'http://161.33.140.139:5001', changeOrigin: true },
      '/datasets': { target: 'http://161.33.140.139:5001', changeOrigin: true },
      '/oauth': { target: 'http://161.33.140.139:5001', changeOrigin: true },
      '/auth': { target: 'http://161.33.140.139:5001', changeOrigin: true },
      '/account': { target: 'http://161.33.140.139:5001', changeOrigin: true },
      '/ai': { target: 'http://161.33.140.139:5001', changeOrigin: true },
    }
  },
})
